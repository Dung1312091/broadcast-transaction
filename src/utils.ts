export const decodeHex = (s: string): Uint8Array => {
  const bytes = s.match(/[0-9A-Fa-f]{2}/g);
  if (!bytes) {
    throw new Error("bad hex string");
  }
  return Uint8Array.from(bytes.map((byte) => parseInt(byte, 16)));
};
