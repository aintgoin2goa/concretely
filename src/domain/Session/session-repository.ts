import {
    get as getFromSession,
    set as setForSession,
} from '../../datasources/session';

export const get = <T>(key: string): T => getFromSession<T>(key);

export const set = <T>(key: string, value: T) => setForSession<T>(key, value);
