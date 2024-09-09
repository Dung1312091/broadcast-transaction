export type TonRequest = {
  /**
   * The raw transaction as boc base64
   */
  rawTransaction: string;
  /**
   * Wallet public key
   */
  publicKey: string;
};

export type SolRequest = {
  /**
   * The raw transaction
   */
  rawTransaction: string;
  /**
   * User solana wallet
   */
  walletAddress: string;
};
