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

  test("Should call correct key on getAll", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.getAll();
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch]);
    expect(cacheStore.key).toBe("purchases");
  });

  test("Should return empty list with getAll fails", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateFetchError();
    expect(await sut.getAll()).toEqual([]);
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
    expect(cacheStore.key).toBe("purchases");
  });

  test("Should return a list of purchases if cache is lass than 3 days old", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.getAll();
    const timestamp = new Date();
    const purchases = mockPurchases();
    cacheStore.fetchData = { timestamp, purchases };

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch]);
    expect(await sut.getAll()).toEqual({ timestamp, purchases });
    expect(cacheStore.key).toBe("purchases");
  });
});
