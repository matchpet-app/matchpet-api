import { QueryFailedError } from 'typeorm';
import { PostgresErrorCode } from './postgres-error-codes';

export async function saveOrMapPostgresError<T>(
  save: () => Promise<T>,
  errorMap: Partial<Record<PostgresErrorCode, () => never>>,
): Promise<T> {
  try {
    return await save();
  } catch (error) {
    if (error instanceof QueryFailedError) {
      const code = (error.driverError as { code?: string })?.code;
      const throwMappedError = errorMap[code as PostgresErrorCode];
      if (throwMappedError) {
        throwMappedError();
      }
    }
    throw error;
  }
}
