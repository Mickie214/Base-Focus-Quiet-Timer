import React from 'react';
import { 
  Transaction, 
  TransactionButton, 
  TransactionError
} from '@coinbase/onchainkit/transaction';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';

// Builder Code from Base documentation example or generic placeholder
// "Builder codes are 8-byte hexadecimal strings"
// We'll use a placeholder that signifies "Base Focus App"
const BUILDER_CODE = '0x42415345464F4353'; // "BASEFOCS" in hex

export const CheckIn: React.FC = () => {
  const { address, isConnected } = useAccount();

  // Simple "Check-in" transaction: send 0 ETH to self with builder code in data
  const calls = [
    {
      to: address as `0x${string}`,
      value: BigInt(0),
      data: BUILDER_CODE as `0x${string}`,
    },
  ];

  const handleSuccess = (response: any) => {
    console.log('Transaction successful', response);
  };

  const handleError = (error: TransactionError) => {
    console.error('Transaction error', error);
  };

  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <Wallet>
          <ConnectWallet className="bg-[#0052ff] hover:bg-[#0041cc] text-white px-8 py-3 rounded-full font-medium transition-all">
             Connect to Check-in
          </ConnectWallet>
        </Wallet>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Transaction
        chainId={base.id}
        calls={calls}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <TransactionButton 
          className="bg-[#0052ff] hover:bg-[#0041cc] text-white px-12 py-4 rounded-full font-bold shadow-2xl shadow-blue-500/20 transition-all border-none"
          text="On-chain Check-in"
        />
      </Transaction>
      <p className="text-xs text-foreground/40 font-mono tracking-widest uppercase">
        Only gas fees • Attribution: {BUILDER_CODE}
      </p>
    </div>
  );
};
