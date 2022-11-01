import { computed, makeObservable, observable } from 'mobx'

import { DataStore } from './data'
import { fallback } from './translations'

export class RootStore {
    readonly data: DataStore

    private readonly _translations = fallback

    get translations(): { strings: typeof fallback } {
        return { strings: this._translations }
    }

    constructor() {
        makeObservable<RootStore, '_translations'>(this, { _translations: observable, translations: computed })

        this.data = new DataStore()
    }
}
