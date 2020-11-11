export default (str: string) => {
  return str.charAt(0).toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
