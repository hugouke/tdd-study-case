export interface Purchases {
    save: (purchases: Array<Purchases.Filds>) => Promise<void>
    getAll: () => Promise<void>
}

export namespace Purchases {
    export type Filds = {
        id: string
        date: Date
        value: number
    }
}