import { action, computed, makeObservable, observable } from 'mobx'
import { v4 as uuid } from 'uuid'

export interface IProduct {
    id: string
    name: string
    unit: string
    unitPrice: number
    variant: string
}

const userKey = 'jms.buy-help.user'

const storageKey = 'jms.buy-help.blob'

export class DataStore {
    readonly all: IProduct[] = []

    connection: 'pending' | 'retry' | 'failed' | 'connected' = 'pending'

    private _userId = ''

    get userId(): string {
        return this._userId
    }

    set userId(userId: string) {
        localStorage.setItem(userKey, userId)

        this._userId = userId

        if (this._userId) {
            this.connection = 'retry'

            this.load()
        }
    }

    editId: string | undefined = undefined

    constructor() {
        this._userId = localStorage.getItem(userKey) || ''

        this.all = JSON.parse(localStorage.getItem(storageKey) ?? '[]')

        makeObservable<DataStore, '_userId'>(this, {
            _userId: observable,
            addOrUpdate: action,
            all: observable,
            connection: observable,
            editId: observable,
            ordered: computed,
            reconnect: action,
            remove: action,
        })

        if (this._userId) {
            this.load()
        }
    }

    private syncStorage(): void {
        localStorage.setItem(storageKey, JSON.stringify(this.all))

        if (this.connection === 'connected') {
            this.save()
        }
    }

    get ordered(): IProduct[] {
        return this.all
            .slice()
            .sort(
                (l, r) =>
                    (l.name || '').toLocaleLowerCase().localeCompare((r.name || '').toLocaleLowerCase()) ||
                    (l.variant || '').toLocaleLowerCase().localeCompare((r.variant || '').toLocaleLowerCase())
            )
    }

    addOrUpdate(product: IProduct): void {
        if (product.id) {
            const index = this.all.findIndex((p) => p.id === product.id)

            if (index < 0) {
                return
            }

            this.all[index] = product
        } else {
            this.all.push({ ...product, id: uuid() })
        }

        this.editId = undefined

        this.syncStorage()
    }

    remove(product: IProduct): void {
        const index = this.all.findIndex((p) => p.id === product.id)

        if (index < 0) {
            return
        }

        this.all.splice(index, 1)

        this.editId = undefined

        this.syncStorage()
    }

    private load(): void {
        const req = new XMLHttpRequest()

        req.onload = () => {
            if (req.status !== 200) {
                this.connection = 'failed'

                return
            }

            try {
                const res = JSON.parse(req.responseText)

                if (res.list) {
                    this.all.splice(0, this.all.length, ...JSON.parse(res.list))
                }

                this.connection = 'connected'
            } catch (error) {
                this.connection = 'failed'
            }
        }

        req.onerror = () => (this.connection = 'failed')
        req.ontimeout = () => (this.connection = 'failed')

        req.open('POST', 'getprices.php')
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        req.send(JSON.stringify({ userid: this._userId }))
    }

    private save(): void {
        const req = new XMLHttpRequest()

        req.onload = () => {
            if (req.status !== 200) {
                this.connection = 'failed'

                return
            }
        }

        req.onerror = () => (this.connection = 'failed')
        req.ontimeout = () => (this.connection = 'failed')

        req.open('POST', 'setprices.php')
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        req.send(JSON.stringify({ list: JSON.stringify(this.all), userid: this._userId }))
    }

    reconnect(): void {
        if (!this._userId) {
            return
        }

        if (this.connection !== 'failed') {
            return
        }

        this.connection = 'retry'

        this.load()
    }
}
