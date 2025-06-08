type PurchaseItem = {
  price: number;
  name: string;
};

export class AsyncifyIterator implements AsyncIterator<unknown> {
  #iterator: Iterator;
  constructor(iterator: Iterator);
  next(): Promise<IteratorResult<unknown>>;
  return(): Promise<IteratorResult<unknown>>;
  throw(): Promise<IteratorResult<unknown>>;
}

export class PurchaseIterator implements Iterator<unknown> {
  #data: PurchaseItem[];
  #index: number;
  #done: boolean;
  constructor(data: PurchaseItem[]);
  next(): IteratorResult<unknown>;
  return(): IteratorResult<unknown>;
  throw(): IteratorResult<unknown>;
}

export class PurchaseIterable
  implements AsyncIterable<unknown>, Iterable<unknown>
{
  constructor(data: PurchaseItem[]);
  static create(data: PurchaseItem[]): PurchaseIterable;
  [Symbol.asyncIterator](): AsyncifyIterator<PurchaseIterator>;
  [Symbol.iterator](): PurchaseIterator;
}

export class Basket {
  #limit: number;
  items: PurchaseItem[];
  total: number;
  errors: string[];
  constructor(limit: number);
  add(item: PurchaseItem): void;
  end(): Promise<{ items: PurchaseItem[]; total: number; errors: string[] }>;
  #checkLimit(item: PurchaseItem): boolean;
}
