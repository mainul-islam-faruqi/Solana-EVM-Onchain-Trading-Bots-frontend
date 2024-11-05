"use client";

import { Chain } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

export const supportedEVMChains: Chain[] = [
  mainnet,
  polygon,
  optimism,
  arbitrum
];

export const defaultChain = mainnet;