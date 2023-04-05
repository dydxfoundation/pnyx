import { AssetSymbol } from '@/enums';

export const ASSET_DECIMALS: { [key in AssetSymbol]: number } = {
  [AssetSymbol.stDYDX]: 18,
  [AssetSymbol.DYDX]: 18,
  [AssetSymbol.USDC]: 6,
};
