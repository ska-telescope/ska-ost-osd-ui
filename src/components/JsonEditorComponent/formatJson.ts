export const formatJson = (value: unknown): string => {
  return JSON.stringify(value, null, 2);
};

export const parseJsonSafely = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch (e) {
    throw e;
  }
};