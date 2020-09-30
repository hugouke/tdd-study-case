import { CacheStore } from "@/data/protocols/cache";
import { GetPurchases, Purchases, SavePurchases } from "@/domain/usecases";

export class LocalPurchases implements SavePurchases, GetPurchases {
  private readonly key = "purchases";

  constructor(private readonly cacheStore: CacheStore) {}

  async save(purchases: Array<Purchases.Filds>): Promise<void> {
    this.cacheStore.replace(this.key, { timestamp: new Date(), purchases });
  }

  async getAll(): Promise<any> {
    try {
      const data = await this.cacheStore.fetch(this.key);
      let expirationDate = new Date();
      let cacheDate = new Date(data.timestamp);
      expirationDate.setDate(expirationDate.getDate() - 3);

      if (cacheDate > expirationDate) {
        return data;
      }

      throw new Error();
    } catch {
      this.cacheStore.delete(this.key);
      return [];
    }
  }
}
