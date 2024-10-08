/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  MessageRelaxed,
  SendMode,
} from "@ton/core";
import { Maybe } from "./utils/maybe";
import { createWalletTransferV4 } from "./createWalletTransfer";

export class WalletContractV4 implements Contract {
  static create(args: {
    workchain: number;
    publicKey: Buffer;
    walletId?: Maybe<number>;
  }) {
    return new WalletContractV4(args.workchain, args.publicKey, args.walletId);
  }

  readonly workchain: number;
  readonly publicKey: Buffer;
  readonly address: Address;
  readonly walletId: number;
  readonly init: { data: Cell; code: Cell };

  private constructor(
    workchain: number,
    publicKey: Buffer,
    walletId?: Maybe<number>
  ) {
    // Resolve parameters
    this.workchain = workchain;
    this.publicKey = publicKey;
    if (walletId !== null && walletId !== undefined) {
      this.walletId = walletId;
    } else {
      this.walletId = 698983191 + workchain;
    }

    // Build initial code and data
    const code = Cell.fromBoc(
      Buffer.from(
        "te6ccgECFAEAAtQAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcCASAICQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAKCwBZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEAgFYDA0AEbjJftRNDXCx+AA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA4PABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVA==",
        "base64"
      )
    )[0];
    const data = beginCell()
      .storeUint(0, 32) // Seqno
      .storeUint(this.walletId, 32)
      .storeBuffer(this.publicKey)
      .storeBit(0) // Empty plugins dict
      .endCell();
    this.init = { code, data };
    this.address = contractAddress(workchain, { code, data });
  }

  /**
   * Get Wallet Balance
   */
  async getBalance(provider: ContractProvider) {
    const state = await provider.getState();
    return state.balance;
  }

  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider: ContractProvider) {
    const state = await provider.getState();
    if (state.state.type === "active") {
      const res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }

  async send(provider: ContractProvider, message: Cell) {
    await provider.external(message);
  }

  createTransfer(args: {
    seqno: number;
    messages: MessageRelaxed[];
    sendMode?: Maybe<SendMode>;
    timeout?: Maybe<number>;
  }) {
    let sendMode = SendMode.PAY_GAS_SEPARATELY;
    if (args.sendMode !== null && args.sendMode !== undefined) {
      sendMode = args.sendMode;
    }
    return createWalletTransferV4({
      seqno: args.seqno,
      sendMode,
      messages: args.messages,
      timeout: args.timeout,
      walletId: this.walletId,
    });
  }
}
