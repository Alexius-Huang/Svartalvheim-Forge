import { ColumnValueType } from "./ModelDecorators";

export function validateRequired(columnName: string, expectedType: string, data: ColumnValueType) {
  if (data === null || data === undefined) {
    throw new Error(`\`${columnName}\` is required and expected to receive \`${expectedType}\` type value, instead got empty value`);
  }
}

export function validateLength(columnName: string, data: string, len: number) {
  if (data.length > len) {
    throw new Error(`\`${columnName}\` exceeds the limit of length \`${len}\``);
  }
}
