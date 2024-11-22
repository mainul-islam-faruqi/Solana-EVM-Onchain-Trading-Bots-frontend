import { PublicKey } from '@solana/web3.js';
import { ESCROW_SEED } from './constants';

export const getEscrowPDA = async (
  user: PublicKey,
  inputMint: PublicKey,
  outputMint: PublicKey,
  applicationIdx: number
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(ESCROW_SEED),
      user.toBuffer(),
      inputMint.toBuffer(),
      outputMint.toBuffer(),
      Buffer.from(applicationIdx.toString())
    ],
    PROGRAM_ID
  );
}; 