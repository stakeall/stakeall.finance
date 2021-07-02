export interface MaticSummary {
   limit?: number;
   offset?: number;
   sortBy?: string;
   direction?: string;
   total?: number;
   size?: number;
}

export interface MaticResult {
   id?: number;
   name?: string;
   description?: any;
   logoUrl?: string;
   owner?: string;
   signer?: string;
   commissionPercent?: number;
   signerPublicKey?: string;
   selfStake?: string;
   delegatedStake?: number;
   isInAuction?: boolean;
   auctionAmount?: number;
   claimedReward?: number;
   activationEpoch?: number;
   totalStaked?: number;
   deactivationEpoch?: number;
   jailEndEpoch?: number;
   status?: string;
   contractAddress?: string;
   uptimePercent?: number;
   delegationEnabled?: boolean;
}

export interface  MaticResponse {
   summary?: MaticSummary;
   success?: boolean;
   status?: string;
   result?: MaticResult[];
}

