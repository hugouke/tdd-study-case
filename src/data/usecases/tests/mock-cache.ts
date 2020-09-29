import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/usecases";

export class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount = 0;
    insertValues: Array<SavePurchases.Params> = [];
    key: string;
  
    delete(key: string): void {
      this.deleteCallsCount++;
      this.key = key;
    }
  
    insert(key: string, value: any): void {
      this.insertCallsCount++;
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