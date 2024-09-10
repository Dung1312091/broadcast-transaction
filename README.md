# Example Client integration

## 1. Ton

```typescript
async function transferTon() {
  const { contract, wallet } = await TonWallet.create("mainnet");
  const transfer = contract.createTransfer(transaction);
  const cell = await contract.sign(transfer);
  const signedRawTransaction = cell.toBoc().toString("base64");
  await axios.post("https://xv7vrzfk-3002.asse.devtunnels.ms/ton/broadcast", {
    signedRawTransaction,
    publicKey: encodeHex(wallet.publicKey),
  });
}
```

## 2. Solana

```typescript
const transferTransaction = await buildSolTransaction({
  connection: connection,
  fromPubKey: fromPubKey,
  sendData,
});
const messageV0 = new TransactionMessage({
  payerKey: fromPubKey,
  recentBlockhash: blockHash,
  instructions: transferTransaction.instructions,
}).compileToV0Message();

const tx = new VersionedTransaction(messageV0);
tx.addSignature(
  fromPubKey,
  await MpcWallet.signEddsaMessage(Buffer.from(tx.message.serialize()))
);
const rs = await axios.post(
  "https://xv7vrzfk-3002.asse.devtunnels.ms/sol/broadcast",
  {
    rawTransaction: encodeHex(tx.serialize()),
    publicKey: fromPubKey.toString(),
  }
);
```
