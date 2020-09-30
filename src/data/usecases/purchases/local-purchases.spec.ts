import { CacheStoreSpy, mockPurchases } from "../tests";
import { LocalPurchases } from "./local-purchases";

type SutTypes = {
  sut: LocalPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalPurchases(cacheStore);
  return { sut, cacheStore };
};

describe("LocalPurchases", () => {
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
    const promise = sut.save(purchases);
    const { timestamp } = cacheStore;
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(cacheStore.key).toBe("purchases");
    expect(cacheStore.insertValues).toEqual({ timestamp, purchases });
    await expect(promise).resolves.toBeFalsy();
  });

  test("Should throw if insert throws", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    await expect(sut.save(mockPurchases())).rejects.toThrow();
  });
});
