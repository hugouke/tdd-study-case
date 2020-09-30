import { CacheStore } from "@/data/protocols/cache";
import { GetPurchases, Purchases, SavePurchases } from "@/domain/usecases";

export class LocalPurchases implements SavePurchases, GetPurchases {
  private readonly key = "purchases";

  constructor(private readonly cacheStore: CacheStore) {}

  async save(purchases: Array<Purchases.Filds>): Promise<void> {
    this.cacheStore.replace(this.key, { timestamp: new Date(), purchases });
  }

  async getAll(): Promise<Array<Purchases.Filds>> {
    try {
      return this.cacheStore.fetch(this.key);
    } catch {
      this.cacheStore.delete(this.key);
      return [];
    }
  }
}
