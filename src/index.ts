import cors from "cors";
import express, { type Express } from "express";
import bodyParser from "body-parser";
import { Cell } from "@ton/core";
import { SolRequest, TonRequest } from "./blockchains/type";
import { TonWallet } from "./blockchains/ton/wallet";
import { SolWallet } from "./blockchains/sol/wallet";
import { decodeHex } from "./utils";

const PORT = 3002;
const app: Express = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_, res) => {
  res.send("POC Broadcast Transaction");
});

app.post("/ton/broadcast", async (req, res) => {
  const data = req.body as TonRequest;
  try {
    const transactionBuffer = Buffer.from(data.signedRawTransaction, "base64");
    const cells = Cell.fromBoc(transactionBuffer);
    const signedCell = cells[0];
    const { contract } = await TonWallet.init("mainnet", data.publicKey);
    const rs = await contract.send(signedCell);
    res.status(200).json({
      status: "success",
      data: rs,
    });
  } catch (error: any) {
    console.error("ton/broadcast error:", error);
    res.status(500).json(error.message);
  }
});

app.post("/sol/broadcast", async (req, res) => {
  const data = req.body as SolRequest;
  try {
    const { connection } = await SolWallet.init(
      "mainnet-beta",
      data.publicKey,
      {
        commitment: "confirmed",
      }
    );
    const txHash = await connection.sendRawTransaction(
      decodeHex(data.signedRawTransaction)
    );
    res.status(200).json({
      status: "success",
      txHash: txHash,
    });
  } catch (error: any) {
    console.error("sol/broadcast error:", error);
    res.status(500).json(error.message);
  }
});

app.listen(PORT, () => {
  console.log("app running on port", PORT);
});
