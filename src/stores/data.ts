import { action, computed, makeObservable, observable } from 'mobx'
import { v4 as uuid } from 'uuid'

export interface IProduct {
    id: string
    name: string
    unit: string
    unitPrice: number
    variant: string
}

const storageKey = 'jms.buy-help.blob'

export class DataStore {
    readonly all: IProduct[] = []

    editId: string | undefined = undefined

    constructor() {
        this.all = JSON.parse(localStorage.getItem(storageKey) ?? '[]')

        makeObservable<DataStore, never>(this, {
            addOrUpdate: action,
            all: observable,
            editId: observable,
            ordered: computed,
            remove: action,
        })
    }

    private syncStorage(): void {
        localStorage.setItem(storageKey, JSON.stringify(this.all))
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
}
