export default (str: string) => (
  str.split('_').reduce((prev, cur) => (
    `${prev}${cur[0].toUpperCase()}${cur.slice(1)}`
  ))
);
