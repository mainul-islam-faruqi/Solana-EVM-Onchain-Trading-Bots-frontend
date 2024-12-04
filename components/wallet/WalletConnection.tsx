"use client";

import { useState, useEffect } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useChain } from '@/contexts/ChainContext';
import { Button } from '@/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { Wallet, ChevronDown, ExternalLink, Power, Copy, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { formatAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

export function WalletConnection() {
  const { isConnected, currentWallet } = useWalletConnection();
  const { selectedChain, setSelectedChain } = useChain();
  const { openConnectModal: openEvmModal } = useConnectModal();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnect: disconnectEvm } = useDisconnect();
  
  // Solana wallet states
  const { 
    wallets,
    select,
    publicKey,
    disconnect: disconnectSolana,
    connected: solanaConnected,
    wallet: selectedWallet,
    connect
  } = useWallet();
  
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (chain?.id) {
      setSelectedNetwork(chain.id);
    }
  }, [chain?.id]);

  useEffect(() => {
    const handleNetworkSwitch = async () => {
      if (isConnected && selectedNetwork && chain?.id !== selectedNetwork) {
        try {
          await switchNetwork?.(selectedNetwork);
        } catch (error) {
          console.error('Failed to switch network:', error);
        }
      }
    };

    handleNetworkSwitch();
  }, [isConnected, selectedNetwork, chain?.id, switchNetwork]);

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      setSelectedNetwork(chainId);
      setSelectedChain('EVM');
      await switchNetwork?.(chainId);
    } catch (error) {
      console.error('Failed to switch network:', error);
      setSelectedNetwork(chain?.id || null);
    }
  };

  const handleSolanaWalletSelect = async (walletName: string) => {
    const wallet = wallets.find(w => w.adapter.name === walletName);
    if (wallet) {
      try {
        select(wallet.adapter.name);
        await connect();
      } catch (error) {
        console.error('Failed to connect to wallet:', error);
      }
    }
  };

  const handleDisconnect = () => {
    if (selectedChain === 'EVM') {
      disconnectEvm();
    } else {
      disconnectSolana();
    }
    setOpen(false);
  };

  const handleCopyAddress = () => {
    let address = '';
    if (selectedChain === 'EVM' && currentWallet?.address) {
      address = currentWallet.address;
    } else if (selectedChain === 'SOLANA' && publicKey) {
      address = publicKey.toBase58();
    }

    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewExplorer = () => {
    let address = '';
    let explorerUrl = '';
    
    if (selectedChain === 'EVM' && currentWallet?.address) {
      address = currentWallet.address;
      if (chain?.id === polygon.id) {
        explorerUrl = `https://polygonscan.com/address/${address}`;
      } else {
        explorerUrl = `https://etherscan.io/address/${address}`;
      }
    } else if (selectedChain === 'SOLANA' && publicKey) {
      address = publicKey.toBase58();
      explorerUrl = `https://solscan.io/account/${address}?cluster=devnet`;
    }
    
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };

  const renderWalletOptions = () => {
    if (selectedChain === 'SOLANA') {
      return (
        <div className="p-2 space-y-2">
          {wallets.map((wallet) => {
            const ready = wallet.adapter.readyState === WalletReadyState.Installed ||
                         wallet.adapter.readyState === WalletReadyState.Loadable;
            const selected = selectedWallet?.adapter.name === wallet.adapter.name;
            
            return (
              <Button
                key={wallet.adapter.name}
                variant={selected ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  !ready && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => ready && handleSolanaWalletSelect(wallet.adapter.name)}
                disabled={!ready}
              >
                {wallet.adapter.icon && (
                  <img 
                    src={wallet.adapter.icon} 
                    alt={`${wallet.adapter.name} icon`}
                    className="w-5 h-5"
                  />
                )}
                {wallet.adapter.name}
                {!ready && " (Not Installed)"}
              </Button>
            );
          })}
        </div>
      );
    }

    return (
      <Button
        className={cn(
          "w-full justify-center",
          "bg-gradient-to-r",
          selectedNetwork === polygon.id
            ? "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            : "from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600",
          "text-white font-medium",
          "shadow-lg",
          selectedNetwork === polygon.id
            ? "shadow-purple-500/20 hover:shadow-purple-500/30"
            : "shadow-violet-500/20 hover:shadow-violet-500/30",
          "hover:shadow-xl",
          "transition-all duration-200"
        )}
        onClick={openEvmModal}
      >
        Connect to {selectedNetwork === polygon.id ? 'Polygon' : 'Ethereum'}
      </Button>
    );
  };

  if (!mounted) {
    return (
      <Button 
        variant="secondary"
        size="sm"
        className={cn(
          "relative overflow-hidden",
          "flex items-center gap-2 h-9 px-4",
          "rounded-full transition-all duration-300",
          "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
          "border border-violet-200/50"
        )}
      >
        <Wallet className="h-4 w-4 text-violet-500" />
        <span className="hidden sm:inline text-violet-100 font-medium">
          Connect Wallet
        </span>
      </Button>
    );
  }

  const isWalletConnected = selectedChain === 'EVM' ? isConnected : solanaConnected;
  const walletAddress = selectedChain === 'EVM' 
    ? currentWallet?.address 
    : publicKey?.toBase58();

  return (
    <div className="relative z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              "relative overflow-hidden",
              "flex items-center gap-2 h-9 px-4",
              "rounded-full transition-all duration-300",
              "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
              "hover:from-violet-500/20 hover:to-purple-500/20",
              "border border-violet-200/50",
              "hover:border-violet-300/50",
              "shadow-[0_2px_10px] shadow-violet-500/10",
              "hover:shadow-[0_4px_20px] hover:shadow-violet-500/20",
              "group"
            )}
          >
            <Wallet className="h-4 w-4 text-violet-500 group-hover:text-violet-400" />
            <span className="hidden sm:inline text-violet-100 font-medium group-hover:text-violet-100">
              {isWalletConnected 
                ? formatAddress(walletAddress || '', 4)
                : 'Connect Wallet'
              }
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 text-violet-400",
              "transition-all duration-200",
              "group-hover:text-violet-500",
              open && "rotate-180"
            )} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end"
          sideOffset={8}
          className={cn(
            "z-50",
            "w-[280px] p-2",
            "bg-white/95 backdrop-blur-sm",
            "rounded-xl",
            "border border-violet-100",
            "shadow-lg shadow-violet-500/10"
          )}
        >
          {/* Network Selection */}
          <div className="px-2 py-1.5 mb-2">
            <div className="text-xs font-medium text-gray-500 mb-2">NETWORK</div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50/50 rounded-lg backdrop-blur-sm">
              <Button
                size="sm"
                variant={selectedNetwork === mainnet.id ? 'default' : 'ghost'}
                onClick={() => handleNetworkSwitch(mainnet.id)}
                className={cn(
                  "text-sm",
                  selectedNetwork === mainnet.id ? "text-white" : "text-gray-700",
                  "hover:text-white active:text-white"
                )}
              >
                Ethereum
              </Button>
              <Button
                size="sm"
                variant={selectedNetwork === polygon.id ? 'default' : 'ghost'}
                onClick={() => handleNetworkSwitch(polygon.id)}
                className={cn(
                  "text-sm",
                  selectedNetwork === polygon.id ? "text-white" : "text-gray-700",
                  "hover:text-white active:text-white"
                )}
              >
                Polygon
              </Button>
              <Button
                size="sm"
                variant={selectedChain === 'SOLANA' ? 'default' : 'ghost'}
                onClick={() => {
                  setSelectedChain('SOLANA')
                  setSelectedNetwork(null)
                }}
                className={cn(
                  "text-sm",
                  selectedChain === 'SOLANA' ? "text-white" : "text-gray-700",
                  "hover:text-white active:text-white"
                )}
              >
                Solana
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator className="my-2 bg-violet-100/50" />

          {/* Connection Status & Actions */}
          {isWalletConnected ? (
            <>
              <div className="px-3 py-2 mx-2 rounded-lg bg-gray-50/50 backdrop-blur-sm border border-violet-100/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-gray-500">CONNECTED TO</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      {selectedChain === 'EVM' 
                        ? selectedNetwork === polygon.id 
                          ? 'Polygon' 
                          : 'Ethereum'
                        : 'Solana'
                      }
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {formatAddress(walletAddress || '', 8)}
                </div>
              </div>

              <div className="p-1.5 grid grid-cols-2 gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleCopyAddress}
                >
                  {copied ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4" />
                  }
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy Address'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleViewExplorer}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">View Explorer</span>
                </Button>
              </div>

              <DropdownMenuSeparator className="my-1.5 bg-violet-100/50" />
              
              <div className="p-1.5">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full flex items-center gap-2 justify-center"
                  onClick={handleDisconnect}
                >
                  <Power className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="p-2">
              {renderWalletOptions()}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}