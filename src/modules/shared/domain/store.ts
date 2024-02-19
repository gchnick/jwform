export type Store = { path: string };

/**
 * The only instance of our Singleton
 */
let instance: ReturnType<typeof makeSingleton<Store>>;

const makeSingleton = <T>(initial: T) => {
  /** Closure of the singleton's value to keep it private */
  let _value: T = initial;
  /** Only the accessors are returned */
  return {
    getValue: (): T => _value,
    setValue: (value: T) => (_value = value),
  };
};

export const getStore = () => {
  if (!instance) {
    return;
  }
  return instance;
};

export const initStore = (initial: Store) => {
  if (!instance) {
    instance = makeSingleton<Store>(initial);
    return instance;
  }
  if (initial) {
    throw new Error("Store already initialised");
  }

  return instance;
};

export function globalStore(path: string) {
  const get = getStore();
  const store = get ? get.getValue() : initStore({ path }).getValue();
  return store;
}
