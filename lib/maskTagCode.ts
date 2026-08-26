export function maskTagCode(tagCode: string) {
  return `••••${tagCode.trim().slice(-4)}`;
}
