import snakeToCamelCase from './snakeToCamelCase';

export default (obj: Record<string, any>) => {
  const keys = Object.keys(obj);

  return keys.reduce((prev, cur) => {
    return Object.assign(prev, {
      [snakeToCamelCase(cur)]: obj[cur]
    });
  }, {});
};
