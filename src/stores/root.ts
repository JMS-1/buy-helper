import { computed, makeObservable, observable } from 'mobx'

import { fallback } from './translations'

export class RootStore {
    private readonly _translations = fallback

    get translations(): { strings: typeof fallback } {
        return { strings: this._translations }
    }

    constructor() {
        makeObservable<RootStore, '_translations'>(this, { _translations: observable, translations: computed })
    }
}
