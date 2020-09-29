import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/usecases";

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Message> = [];
  insertValues: Array<SavePurchases.Params> = [];
  key: string;

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.key = key;
  }

  insert(key: string, value: any): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.key = key;
    this.insertValues = value;
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
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert,
  }
}
