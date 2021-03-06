export interface SavePurchases {
    save: (purchases: Array<Purchases.Filds>) => Promise<void>
}

export interface GetPurchases {
    getAll: () => Promise<any>
}

export namespace Purchases {
    export type Filds = {
        id: string
        date: Date
        value: number
    }
}