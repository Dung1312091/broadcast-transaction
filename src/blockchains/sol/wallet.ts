import {
  clusterApiUrl,
  Connection,
  ConnectionConfig,
  PublicKey,
} from "@solana/web3.js";

const RPC = {
  https:
    "https://broken-late-panorama.solana-mainnet.quiknode.pro/71a6fb542d7d3e0ae842f5804546b1ddeb0cbb70",
  wss: "wss://broken-late-panorama.solana-mainnet.quiknode.pro/71a6fb542d7d3e0ae842f5804546b1ddeb0cbb70",
};
export class SolWallet {
  static async init(
    network: "devnet" | "testnet" | "mainnet-beta",
    publicKey: string,
    commitmentOrConfig: ConnectionConfig
  ) {
    const fromPubKey = new PublicKey(publicKey);
    const rpcUrl =
      network === "mainnet-beta" ? RPC.https : clusterApiUrl(network);
    const wssUrl =
      network === "mainnet-beta" ? RPC.wss : clusterApiUrl(network);
    const connection = new Connection(rpcUrl, {
      ...commitmentOrConfig,
      wsEndpoint: wssUrl,
    });
    const blockHash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    return { fromPubKey, connection, blockHash };
  }
}
