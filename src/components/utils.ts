import { JsonObject } from './JsonEditorComponent/types';

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

export const findThirdKey = (obj: JsonObject): string | undefined => {
  const keys: string[] = [];

  // Recursive function to collect keys
  const traverse = (o: JsonObject) => {
    if (o && typeof o === 'object') {
      Object.keys(o).forEach((key) => {
        keys.push(key);
        traverse(o[key] as JsonObject);
      });
    }
  };

  traverse(obj);

  return keys[2];
};
