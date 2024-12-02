import { render, screen, fireEvent, act } from '@testing-library/react'
import { ExecutionPanel } from '../execution-panel'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { Program } from '@coral-xyz/anchor'
import { web3 } from '@coral-xyz/anchor'

// Mock dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
  useConnection: jest.fn()
}));

jest.mock('@coral-xyz/anchor', () => {
  const mockProgram = {
    methods: {
      setupDca: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          rpc: jest.fn().mockResolvedValue('mockTxSignature')
        })
      })
    }
  };

  return {
    Program: jest.fn().mockReturnValue(mockProgram),
    web3: {
      PublicKey: jest.fn().mockImplementation((key) => ({ toString: () => key })),
      SystemProgram: {
        programId: 'mockSystemProgramId'
      }
    }
  };
});

// Mock strategy and DCA config
const mockStrategy = {
  id: '1',
  name: 'Test Strategy',
  blocks: [],
  connections: []
};

const mockDcaConfig = {
  applicationIdx: 0,
  inAmount: 1000000000, // 1 SOL in lamports
  inAmountPerCycle: 100000000, // 0.1 SOL per cycle
  cycleFrequency: 3600, // 1 hour
  minOutAmount: undefined,
  maxOutAmount: undefined,
  startAt: undefined,
  inputMint: 'So11111111111111111111111111111111111111112', // SOL mint
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC mint
};

describe('ExecutionPanel DCA Integration', () => {
  beforeEach(() => {
    // Mock wallet connection
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: new web3.PublicKey('mockPublicKey'),
      signTransaction: jest.fn(),
      signAllTransactions: jest.fn()
    });

    // Mock connection
    (useConnection as jest.Mock).mockReturnValue({
      connection: {
        getRecentBlockhash: jest.fn().mockResolvedValue({
          blockhash: 'mockBlockhash',
          lastValidBlockHeight: 1234
        })
      }
    });
  });

  it('renders DCA setup button when wallet is connected', () => {
    render(
      <ExecutionPanel 
        strategy={mockStrategy}
        dcaConfig={mockDcaConfig}
        onExecutionStateChange={jest.fn()}
      />
    );

    expect(screen.getByText('Start DCA')).toBeInTheDocument();
  });

  it('shows connect wallet message when wallet is not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: false,
      publicKey: null
    });

    render(
      <ExecutionPanel 
        strategy={mockStrategy}
        dcaConfig={mockDcaConfig}
        onExecutionStateChange={jest.fn()}
      />
    );

    expect(screen.getByText('Connect Wallet to Start DCA')).toBeInTheDocument();
  });

  it('executes DCA setup when button is clicked', async () => {
    const mockOnExecutionStateChange = jest.fn();
    const mockSetupDca = jest.fn().mockResolvedValue('mockTxSignature');
    
    const mockProgramInstance = {
      methods: {
        setupDca: jest.fn().mockReturnValue({
          accounts: jest.fn().mockReturnValue({
            rpc: mockSetupDca
          })
        })
      }
    };
    
    (Program as unknown as jest.Mock).mockReturnValue(mockProgramInstance);

    render(
      <ExecutionPanel 
        strategy={mockStrategy}
        dcaConfig={mockDcaConfig}
        onExecutionStateChange={mockOnExecutionStateChange}
      />
    );

    const setupButton = screen.getByText('Start DCA');
    
    await act(async () => {
      fireEvent.click(setupButton);
    });

    // Verify setupDca was called with correct parameters
    const setupDcaCall = mockProgramInstance.methods.setupDca.mock.calls[0];
    expect(setupDcaCall).toEqual([
      mockDcaConfig.applicationIdx,
      mockDcaConfig.inAmount,
      mockDcaConfig.inAmountPerCycle,
      mockDcaConfig.cycleFrequency,
      mockDcaConfig.minOutAmount,
      mockDcaConfig.maxOutAmount,
      mockDcaConfig.startAt
    ]);

    // Verify execution state change was called
    expect(mockOnExecutionStateChange).toHaveBeenCalledWith({
      status: 'success',
      lastUpdate: expect.any(Date),
      errors: []
    });
  });

  it('handles DCA setup errors', async () => {
    const mockError = new Error('DCA setup failed');
    const mockSetupDca = jest.fn().mockRejectedValue(mockError);
    
    const mockProgramInstance = {
      methods: {
        setupDca: jest.fn().mockReturnValue({
          accounts: jest.fn().mockReturnValue({
            rpc: mockSetupDca
          })
        })
      }
    };
    
    (Program as unknown as jest.Mock).mockReturnValue(mockProgramInstance);

    const mockOnExecutionStateChange = jest.fn();

    render(
      <ExecutionPanel 
        strategy={mockStrategy}
        dcaConfig={mockDcaConfig}
        onExecutionStateChange={mockOnExecutionStateChange}
      />
    );

    const setupButton = screen.getByText('Start DCA');
    
    await act(async () => {
      fireEvent.click(setupButton);
    });

    // Verify error state
    expect(mockOnExecutionStateChange).toHaveBeenCalledWith({
      status: 'error',
      lastUpdate: expect.any(Date),
      errors: ['DCA setup failed']
    });

    // Verify error message is displayed
    expect(screen.getByText('DCA setup failed')).toBeInTheDocument();
  });
}); 