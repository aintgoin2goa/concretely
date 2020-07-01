const sessionData = new Map<string, unknown>();

export const set = <T = unknown>(key: string, value: T) => {
    sessionData.set(key, value);
};

export const get = <T = unknown>(key: string): T => {
    return sessionData.get(key) as T;
};
