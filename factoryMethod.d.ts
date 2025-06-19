export class FileLineCursor {
  constructor(fileStorage: FileStorage, query: unknown);
  [Symbol.asyncIterator](): AsyncIterator<unknown>;
}

export class FileStorage {
  constructor(filePath: string);
  select(query: unknown): FileLineCursor;
}
