import React from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { motion } from 'motion/react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { stringToHex } from 'viem';

const ABI = [
  {
    "inputs": [{ "internalType": "bytes8", "name": "builderCode", "type": "bytes8" }],
    "name": "checkIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// UPDATED: Real contract address provided by user
const CONTRACT_ADDRESS = '0xAcEAA79aA7DdFcc942f5DE5E730B208ad3A7cEf2'; 

// UPDATED: Correctly encoded Builder Code (8 bytes from "mk716824")
const BUILDER_CODE_HEX = stringToHex('mk716824', { size: 8 });

export const CheckIn: React.FC = () => {
  const { isConnected } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleCheckIn = () => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'checkIn',
      args: [BUILDER_CODE_HEX],
    });
  };

  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <Wallet>
          <ConnectWallet className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-medium transition-all shadow-xl shadow-blue-500/10" />
        </Wallet>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {!isSuccess ? (
        <button
          disabled={isPending || isConfirming}
          onClick={handleCheckIn}
          className="bg-[#0052ff] disabled:opacity-50 hover:bg-[#0041cc] text-white px-12 py-4 rounded-full font-bold shadow-2xl shadow-blue-500/20 transition-all border-none cursor-pointer flex items-center gap-3"
        >
          {isPending || isConfirming ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'On-chain Check-in'}
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] uppercase tracking-widest bg-blue-500/10 px-6 py-3 rounded-full border border-blue-500/20">
            <CheckCircle2 className="w-4 h-4" />
            Session Anchored
          </div>
          
          <a 
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[9px] font-mono text-foreground/30 hover:text-foreground/60 transition-colors uppercase tracking-widest"
          >
            Transaction Hash <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      )}

      <div className="flex flex-col items-center gap-1 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[7px] font-mono uppercase tracking-[0.3em]">
          Builder Code: {BUILDER_CODE_HEX}
        </p>
        <p className="text-[7px] font-mono uppercase tracking-[0.3em]">
          Source: bc_mk716824
        </p>
      </div>
    </div>
  );
};
