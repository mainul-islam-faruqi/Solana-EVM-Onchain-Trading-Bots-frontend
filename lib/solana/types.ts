import { PublicKey } from '@solana/web3.js';

export interface SetupDcaAccounts {
  jupDcaProgram: PublicKey;     // Jupiter DCA program ID
  jupDca: PublicKey;            // Jupiter DCA state account
  inputMint: PublicKey;         // Input token mint
  outputMint: PublicKey;        // Output token mint
  user: PublicKey;              // User's wallet
  userTokenAccount: PublicKey;  // User's token account for input token
  escrow: PublicKey;           // Our program's escrow PDA
  escrowInAta: PublicKey;      // Escrow's ATA for input token
  escrowOutAta: PublicKey;     // Escrow's ATA for output token
  systemProgram: PublicKey;     // System Program
  tokenProgram: PublicKey;      // Token Program
  associatedTokenProgram: PublicKey; // Associated Token Program
} 