export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const formatJson = (obj: Record<string, unknown>): string => {
  return JSON.stringify(obj, null, 2);
};