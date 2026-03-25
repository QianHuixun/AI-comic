declare module "multer" {
  type MemoryStorage = {
    _memoryStorageBrand?: true;
  };

  interface MulterMiddleware {
    single(fieldName: string): import("express").RequestHandler;
  }

  interface MulterStatic {
    (options?: { storage?: MemoryStorage }): MulterMiddleware;
    memoryStorage(): MemoryStorage;
  }

  const multer: MulterStatic;
  export default multer;
}
