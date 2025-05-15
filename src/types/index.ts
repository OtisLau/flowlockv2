export interface EscrowData {
  claimedAmount: number;
  timeRemaining: number;
  claimableBalance: number;
  senderApproved: boolean;
  payoutMode: 'aptos' | 'stellar';
  isVerified: boolean;
}

export interface WalletContextType {
  wallet: any;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  client: any;
} 