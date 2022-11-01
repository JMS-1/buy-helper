import { computed, makeObservable, observable } from 'mobx'
import { v4 as uuid } from 'uuid'

export interface IProduct {
    id: string
    name: string
    unit: string
    unitPrice: number
    variant: string
}

export class DataStore {
    readonly all: IProduct[] = []

    editId: string | undefined = undefined

    constructor() {
        for (let n = 0; n++ <= 100; ) {
            this.all.push({
                id: uuid(),
                name: `Name ${n}`,
                unit: 'kg',
                unitPrice: Math.floor(1000 * Math.random()) / 100,
                variant: n % 13 ? '' : `Variante ${n}`,
            })
        }

        makeObservable<DataStore, never>(this, { all: observable, editId: observable, ordered: computed })
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
    }

    remove(product: IProduct): void {
        const index = this.all.findIndex((p) => p.id === product.id)

        if (index < 0) {
            return
        }

        this.all.splice(index, 1)

        this.editId = undefined
    }
}
