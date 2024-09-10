import { decodeHex } from "@/utils";
import { TonClient4 } from "./client/TonClient4";
import { WalletContractV4 } from "./WalletContractV4";

enum NetWorkEndpoint {
  testnet = "https://testnet-v4.tonhubapi.com",
  mainnet = "https://mainnet-v4.tonhubapi.com",
}

export class TonWallet {
  static async init(network: "testnet" | "mainnet", publicKey: string) {
    const client = new TonClient4({ endpoint: NetWorkEndpoint[network] });
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(decodeHex(publicKey)),
    });
    const contract = await client.open(wallet);
    return { wallet, contract, client };
  }
}
