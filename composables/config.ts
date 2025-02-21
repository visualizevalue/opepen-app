export const useConfig = (key: string) => useRuntimeConfig().public[key]

export const useApiBase = (): string => useConfig('opepenApi') as string

