import type { EntityTarget, Repository } from 'typeorm';
import { useConnection } from './useConnection';

export async function useRepository<T>(
  model: EntityTarget<T>,
  callback: (repo: Repository<T>) => void
): Promise<void> {
  return useConnection(async (conn) => {
    callback(conn.getRepository(model));
  });
}
