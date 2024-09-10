export type TonRequest = {
  /**
   * The signed raw transaction as boc base64
   */
  signedRawTransaction: string;
  /**
   * Wallet public key
   */
  publicKey: string;
};

export type SolRequest = {
  /**
   * The signed raw transaction
   */
  signedRawTransaction: string;
  /**
   * Wallet public key
   */
  publicKey: string;
};
