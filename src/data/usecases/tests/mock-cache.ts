import { CacheStore } from "@/data/protocols/cache";
import { Purchases } from "@/domain/usecases";

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Message> = [];
  insertValues: Array<Purchases.Filds> = [];
  fetchData: any = [];
  timestamp: Date = new Date();
  key: string;

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.key = key;
  }

  insert(key: string, value: any): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.key = key;
    this.timestamp = value.timestamp;
    this.insertValues = value;
  }

  replace(key: string, value: any): void {
    this.delete(key);
    this.insert(key, value);
  }

  async fetch(key: string): Promise<any> {
    this.key = key;
    this.messages.push(CacheStoreSpy.Message.fetch);
    return this.fetchData;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "fetch").mockImplementationOnce(() => {
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert,
    fetch,
  }
}
