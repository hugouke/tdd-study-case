export class CachePolicy {
  private static maxAgeInDays = 3;

  private constructor() {}

  static validate(date: Date): boolean {
    const expirationDate = CachePolicy.getCacheExpirationDate();
    console.log(date);
    console.log('*'+expirationDate);
    return date > expirationDate;
  }

  static getCacheExpirationDate = (): Date => {
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - CachePolicy.maxAgeInDays);
    return expirationDate;
  };
}
