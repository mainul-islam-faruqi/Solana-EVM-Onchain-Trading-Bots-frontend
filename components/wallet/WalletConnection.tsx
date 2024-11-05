"use client";

import { useState, useEffect } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useChain } from '@/contexts/ChainContext';
import { Button } from '@/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, ChevronDown, ExternalLink, Power, Copy, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { formatAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { useWallet } from '@solana/wallet-adapter-react';

export function WalletConnection() {
  const { isConnected, currentWallet, walletState } = useWalletConnection();
  const { selectedChain, setSelectedChain } = useChain();
  const { openConnectModal: openEvmModal } = useConnectModal();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
  const { disconnect: disconnectEvm } = useDisconnect();
  const { disconnect: disconnectSolana } = useWallet();

  useEffect(() => {
    if (chain?.id) {
      setSelectedNetwork(chain.id);
    }
  }, [chain]);

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

  const isNetworkActive = (chainId: number) => {
    return selectedChain === 'EVM' && selectedNetwork === chainId;
  };

  const handleCopyAddress = () => {
    if (currentWallet?.address) {
      navigator.clipboard.writeText(currentWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewExplorer = () => {
    if (!currentWallet?.address) return;
    let explorerUrl = '';
    
    if (selectedChain === 'EVM') {
      if (chain?.id === polygon.id) {
        explorerUrl = `https://polygonscan.com/address/${currentWallet.address}`;
      } else {
        explorerUrl = `https://etherscan.io/address/${currentWallet.address}`;
      }
    } else {
      explorerUrl = `https://solscan.io/account/${currentWallet.address}`;
    }
    
    window.open(explorerUrl, '_blank');
  };

  const handleDisconnect = () => {
    if (selectedChain === 'EVM') {
      disconnectEvm();
    } else {
      disconnectSolana();
    }
    setOpen(false);
  };

  const handleEvmConnect = async () => {
    try {
      // Just open the connect modal - network switching will happen after wallet selection
      openEvmModal?.();
      setOpen(false);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const getConnectButtonText = () => {
    if (selectedChain === 'EVM') {
      if (selectedNetwork === polygon.id) {
        return 'Connect to Polygon';
      }
      return 'Connect to Ethereum';
    }
    return 'Connect Solana Wallet';
  };

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
              "before:absolute before:inset-0",
              "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
              "before:translate-x-[-200%] hover:before:translate-x-[200%]",
              "before:transition-transform before:duration-700",
              "group"
            )}
          >
            <Wallet className={cn(
              "h-4 w-4 text-violet-500",
              "transition-colors duration-200",
              "group-hover:text-violet-400"
            )} />
            <span className={cn(
              "hidden sm:inline",
              "text-violet-100 font-medium",
              "transition-colors duration-200",
              "group-hover:text-violet-100"
            )}>
              {isConnected 
                ? formatAddress(currentWallet?.address || '', 4)
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
            "shadow-lg shadow-violet-500/10",
            "data-[state=open]:animate-in",
            "data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0",
            "data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95",
            "data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* Network Selection */}
          <div className="px-2 py-1.5 mb-2">
            <div className="text-xs font-medium text-gray-500 mb-2">NETWORK</div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50/50 rounded-lg backdrop-blur-sm">
              <Button
                size="sm"
                variant={isNetworkActive(mainnet.id) ? 'default' : 'ghost'}
                onClick={() => handleNetworkSwitch(mainnet.id)}
                className={cn(
                  "relative overflow-hidden",
                  "text-sm font-medium",
                  "transition-all duration-300",
                  isNetworkActive(mainnet.id)
                    ? [
                        "bg-gradient-to-r from-violet-500 to-purple-500",
                        "text-white shadow-lg shadow-violet-500/25",
                        "border border-violet-400/50",
                        "hover:shadow-xl hover:shadow-violet-500/30",
                        "hover:from-violet-600 hover:to-purple-600",
                        "before:absolute before:inset-0",
                        "before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
                        "before:translate-x-[-200%]",
                        "hover:before:translate-x-[200%]",
                        "before:transition-transform before:duration-700",
                      ]
                    : [
                        "text-violet-700 bg-transparent",
                        "hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50",
                        "hover:text-violet-700 hover:shadow-md hover:shadow-violet-500/10",
                        "active:from-violet-100 active:to-purple-100",
                        "border border-transparent hover:border-violet-200/50",
                      ]
                )}
              >
                Ethereum
              </Button>
              <Button
                size="sm"
                variant={isNetworkActive(polygon.id) ? 'default' : 'ghost'}
                onClick={() => handleNetworkSwitch(polygon.id)}
                className={cn(
                  "relative overflow-hidden",
                  "text-sm font-medium",
                  "transition-all duration-300",
                  isNetworkActive(polygon.id)
                    ? [
                        "bg-gradient-to-r from-purple-500 to-indigo-500",
                        "text-white shadow-lg shadow-purple-500/25",
                        "border border-purple-400/50",
                        "hover:shadow-xl hover:shadow-purple-500/30",
                        "hover:from-purple-600 hover:to-indigo-600",
                        "before:absolute before:inset-0",
                        "before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
                        "before:translate-x-[-200%]",
                        "hover:before:translate-x-[200%]",
                        "before:transition-transform before:duration-700",
                      ]
                    : [
                        "text-purple-700 bg-transparent",
                        "hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50",
                        "hover:text-purple-700 hover:shadow-md hover:shadow-purple-500/10",
                        "active:from-purple-100 active:to-indigo-100",
                        "border border-transparent hover:border-purple-200/50",
                      ]
                )}
              >
                Polygon
              </Button>
              <Button
                size="sm"
                variant={selectedChain === 'SOLANA' ? 'default' : 'ghost'}
                onClick={() => setSelectedChain('SOLANA')}
                className={cn(
                  "relative overflow-hidden",
                  "text-sm font-medium",
                  "transition-all duration-300",
                  selectedChain === 'SOLANA'
                    ? [
                        "bg-gradient-to-r from-orange-500 to-red-500",
                        "text-white shadow-lg shadow-orange-500/25",
                        "border border-orange-400/50",
                        "hover:shadow-xl hover:shadow-orange-500/30",
                        "hover:from-orange-600 hover:to-red-600",
                        "before:absolute before:inset-0",
                        "before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
                        "before:translate-x-[-200%]",
                        "hover:before:translate-x-[200%]",
                        "before:transition-transform before:duration-700",
                      ]
                    : [
                        "text-orange-700 bg-transparent",
                        "hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50",
                        "hover:text-orange-700 hover:shadow-md hover:shadow-orange-500/10",
                        "active:from-orange-100 active:to-red-100",
                        "border border-transparent hover:border-orange-200/50",
                      ]
                )}
              >
                Solana
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator className="my-2 bg-violet-100/50" />

          {/* Connection Status & Actions */}
          {isConnected ? (
            <>
              <div className={cn(
                "px-3 py-2 mx-2 rounded-lg",
                "bg-gradient-to-r from-gray-50/50 to-gray-100/50",
                "backdrop-blur-sm border border-violet-100/20"
              )}>
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
                  {formatAddress(currentWallet?.address || '', 8)}
                </div>
                {currentWallet?.balance && (
                  <div className="text-sm text-gray-600">
                    {currentWallet.balance} {currentWallet.network}
                  </div>
                )}
              </div>

              <div className="p-1.5 grid grid-cols-2 gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2",
                    "text-gray-600 hover:text-violet-700",
                    "hover:bg-violet-50/50",
                    "transition-all duration-200"
                  )}
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
                  className={cn(
                    "flex items-center gap-2",
                    "text-gray-600 hover:text-violet-700",
                    "hover:bg-violet-50/50",
                    "transition-all duration-200"
                  )}
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
                  className={cn(
                    "w-full flex items-center gap-2 justify-center",
                    "bg-red-50 text-red-600 border border-red-200",
                    "hover:bg-red-500 hover:text-white",
                    "transition-all duration-200"
                  )}
                  onClick={handleDisconnect}
                >
                  <Power className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="p-2">
              {selectedChain === 'EVM' ? (
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
                  onClick={handleEvmConnect}
                >
                  {getConnectButtonText()}
                </Button>
              ) : (
                <div className={cn(
                  "w-full",
                  "[&>button]:w-full [&>button]:h-9",
                  "[&>button]:bg-gradient-to-r [&>button]:from-orange-500 [&>button]:to-red-500",
                  "[&>button]:hover:from-orange-600 [&>button]:hover:to-red-600",
                  "[&>button]:rounded-lg [&>button]:font-medium",
                  "[&>button]:shadow-lg [&>button]:shadow-orange-500/20",
                  "[&>button]:hover:shadow-xl [&>button]:hover:shadow-orange-500/30",
                  "[&>button]:transition-all [&>button]:duration-200"
                )}>
                  <WalletMultiButton />
                </div>
              )}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}