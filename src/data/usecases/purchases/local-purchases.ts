import { CacheStore } from "@/data/protocols/cache";
import { Purchases } from "@/domain/usecases";

export class LocalPurchases implements Purchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(purchases: Array<Purchases.Filds>): Promise<void> {
    this.cacheStore.replace("purchases", { timestamp: new Date(), purchases });
  }

  async getAll(): Promise<void> {
    this.cacheStore.delete("purchases");
  }
}
