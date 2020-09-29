import { CacheStoreSpy, mockPurchases } from "../tests";
import { LocalSavePurchases } from "./local-save-purchases";

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);
  return { sut, cacheStore };
};

describe("LocalSavePurchases", () => {
  test("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });
  
  test("Should not insert new cache if delete fails", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    await expect(sut.save(mockPurchases())).rejects.toThrow();
  });

  test("Should insert new cache if delete succeds", async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(cacheStore.key).toBe("purchases");
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  test("Should throw if insert throws", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    await expect(sut.save(mockPurchases())).rejects.toThrow();
  });
});
