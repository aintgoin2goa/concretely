import * as repo from './session-repository';

export const getFromSession = <T = unknown>(key: string): T => repo.get<T>(key);

export const setForSession = <T>(key: string, value: T) =>
    repo.set<T>(key, value);
