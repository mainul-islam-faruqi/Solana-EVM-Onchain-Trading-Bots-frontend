import IDL from '../../../../solana-programs/on-chain-trading-bot/target/idl/on_chain_trading_bot.json';
import { PROGRAM_ID } from '../program';

// Add address to IDL
const IDLWithAddress = {
  ...IDL,
  address: PROGRAM_ID.toString()
};

export { IDLWithAddress as IDL };
export type TradingBotIDL = typeof IDLWithAddress;