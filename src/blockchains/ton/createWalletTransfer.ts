import { beginCell, MessageRelaxed, storeMessageRelaxed } from '@ton/core';
import { Maybe } from './utils/maybe';

export function createWalletTransferV4(args: {
	seqno: number;
	sendMode: number;
	walletId: number;
	messages: MessageRelaxed[];
	timeout?: Maybe<number>;
}) {
	// Check number of messages
	if (args.messages.length > 4) {
		throw Error('Maximum number of messages in a single transfer is 4');
	}

	const signingMessage = beginCell().storeUint(args.walletId, 32);
	if (args.seqno === 0) {
		for (let i = 0; i < 32; i++) {
			signingMessage.storeBit(1);
		}
	} else {
		signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32); // Default timeout: 60 seconds
	}
	signingMessage.storeUint(args.seqno, 32);
	signingMessage.storeUint(0, 8); // Simple order
	for (const m of args.messages) {
		signingMessage.storeUint(args.sendMode, 8);
		signingMessage.storeRef(beginCell().store(storeMessageRelaxed(m)));
	}

	return signingMessage;
}
