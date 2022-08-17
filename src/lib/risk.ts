export enum RiskType {
  OWNERSHIP = 'OWNERSHIP',
  COUNTERPARTY = 'COUNTERPARTY',
}

export interface RiskDataResponse {
  accountExternalId: string
  address: string
  addressRiskIndicators: {
    category: string
    categoryId: string
    categoryRiskScoreLevel: string
    categoryRiskScoreLevelLabel: string
    incomingVolumeUsd: string
    outgoingVolumeUsd: string
    riskType: RiskType
    totalVolumeUsd: string
  }[]
  addressSubmitted: string
  chain: string
  entities: {
    category: string
    categoryId: string
    riskScoreLevel: number
    riskScoreLevelLabel: string
    trmAppUrl: string
    trmUrn: string
  }[]
  trmAppUrl: string
}

export const getRiskData = async ({ walletAddress }: { walletAddress: string }): Promise<RiskDataResponse> => {
  const resp = await fetch(
    `https://api.trmlabs.com/public/v2/screening/addresses`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.REACT_APP_TRM_API_KEY}`,
      },
      body: JSON.stringify([{
        address: walletAddress,
        chain: 'ethereum',
      }]),
    }
  );

  const data = await resp.json();
  return data;
};
