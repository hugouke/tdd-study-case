import { Purchases } from "@/domain/usecases";
import faker from "faker";

export const mockPurchases = (): Array<Purchases.Filds> => [
  {
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: faker.random.number(),
  },
  {
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: faker.random.number(),
  }
];
