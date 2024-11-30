import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from './constants';
import { PROGRAM_ID } from './program';

const PROGRAM_ID_PUBKEY = new PublicKey(PROGRAM_ID);

export const ESCROW_SEED = 'escrow';

export const getAssociatedTokenAddress = async (
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> => {
  const [address] = await PublicKey.findProgramAddress(
    [
      owner.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return address;
};

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
    PROGRAM_ID_PUBKEY
  );
};

// Re-export constants
export { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID }; 