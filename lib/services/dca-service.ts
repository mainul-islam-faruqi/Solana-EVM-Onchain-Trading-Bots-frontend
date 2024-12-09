import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN, Wallet, Idl } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { DCAConfig } from '@/components/bot-builder/types';
import { IDL } from '../solana/idl/trading_bot';
import { PROGRAM_IDS, ACCOUNTS } from '../solana/constants';
import { SetupDcaAccounts } from '@/lib/solana/types';

export class DCAService {
  private program: Program;
  private connection: Connection;
  private provider: AnchorProvider;

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed'
    });
    this.program = new Program(IDL as Idl, PROGRAM_IDS.TRADING_BOT, this.provider);
  }

  async setupDCA(config: DCAConfig) {
    try {
      const inputMint = new PublicKey(config.inputMint);
      const outputMint = new PublicKey(config.outputMint);
      const user = this.provider.wallet.publicKey;

      // Get user's token account
      const userTokenAccount = await getAssociatedTokenAddress(
        inputMint,
        user,
        false
      );

      // Derive escrow PDA
      const [escrow] = await PublicKey.findProgramAddress(
        [
          Buffer.from('escrow'),
          user.toBuffer(),
          inputMint.toBuffer(),
          outputMint.toBuffer(),
          new BN(config.applicationIdx).toArrayLike(Buffer, 'le', 8)
        ],
        this.program.programId
      );

      // Get escrow token accounts
      const escrowInAta = await getAssociatedTokenAddress(
        inputMint,
        escrow,
        true
      );

      const escrowOutAta = await getAssociatedTokenAddress(
        outputMint,
        escrow,
        true
      );

      const accounts: SetupDcaAccounts = {
        jupDcaProgram: PROGRAM_IDS.JUPITER_DCA,
        jupDca: ACCOUNTS.JUPITER_DCA,
        inputMint,
        outputMint,
        user,
        userTokenAccount,
        escrow,
        escrowInAta,
        escrowOutAta,
        systemProgram: PublicKey.default,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      // Create transaction
      const tx = await this.program.methods
        .setupDca(
          new BN(config.applicationIdx),
          new BN(config.inAmount),
          new BN(config.inAmountPerCycle),
          new BN(config.cycleFrequency),
          config.minOutAmount ? new BN(config.minOutAmount) : null,
          config.maxOutAmount ? new BN(config.maxOutAmount) : null,
          config.startAt ? new BN(config.startAt) : null
        )
        .accounts(accounts)
        .transaction();

      // Sign and send transaction
      const signature = await this.provider.sendAndConfirm(tx);
      return { success: true, signature };

    } catch (error) {
      console.error('Error setting up DCA:', error);
      throw error;
    }
  }
} 