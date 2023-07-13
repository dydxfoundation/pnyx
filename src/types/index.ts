import { ButtonColor } from '@/components/Button';

import * as AllowancesTypes from './allowances';
import * as BalancesTypes from './balances';
import * as DistributionTypes from './distribution';
import * as GeoTypes from './geo';
import * as GovernanceTypes from './governance';
import * as LocalizationTypes from './localization';
import * as LocalStorageTypes from './local-storage';
import * as ModalTypes from './modals';
import * as NetworkTypes from './network';
import * as NotificationTypes from './notifications';
import * as PageTypes from './page';
import * as StakingPoolsTypes from './staking-pools';
import * as StylesTypes from './styles';
import * as TradingRewardsTypes from './trading-rewards';
import * as WalletsTypes from './wallets';

export type NoOpFunction = () => void;

export type CtaConfig = {
  color?: ButtonColor;
  disabled?: boolean;
  href?: string;
  isLoading?: boolean;
  label: string;
  linkOutIcon?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

// Allowances Types
export type AllowancesState = AllowancesTypes.AllowancesState;
export type SetAllowancePayload = AllowancesTypes.SetAllowancePayload;
export type SetUserSentAllowanceTransactionPayload = AllowancesTypes.SetUserSentAllowanceTransactionPayload;

// Balances Types
export type StakingBalances = BalancesTypes.StakingBalances;
export type StakingBalancesData = BalancesTypes.StakingBalancesData;
export type SetStakingBalancesDataPayload = BalancesTypes.SetStakingBalancesDataPayload;

export type WalletBalancesData = BalancesTypes.WalletBalancesData;
export type SetWalletBalancesDataPayload = BalancesTypes.SetWalletBalancesDataPayload;

export type PoolWithdrawBalancesData = BalancesTypes.PoolWithdrawBalancesData;
export type WithdrawBalancesData = BalancesTypes.WithdrawBalancesData;
export type SetWithdrawBalancesDataPayload = BalancesTypes.SetWithdrawBalancesDataPayload;

export type UnclaimedRewardsData = BalancesTypes.UnclaimedRewardsData;
export type SetUnclaimedRewardsPayload = BalancesTypes.SetUnclaimedRewardsPayload;

// Distribution Types
export type SetCirculatingSupplyPayload = DistributionTypes.SetCirculatingSupplyPayload;
export type SetDistributedTodayPayload = DistributionTypes.SetDistributedTodayPayload;

// Geo Types
export type GeoData = GeoTypes.GeoData;
export type SetGeoDataPayload = GeoTypes.SetGeoDataPayload;

// Governance Types
export type DelegatePowersTxHashes = GovernanceTypes.DelegatePowersTxHashes;
export type GovernancePowersData = GovernanceTypes.GovernancePowersData;
export type SetGovernancePowersDataPayload = GovernanceTypes.SetGovernancePowersDataPayload;
export type SetLatestProposalsPayload = GovernanceTypes.SetLatestProposalsPayload;
export type VotedOnProposalData = GovernanceTypes.VotedOnProposalData;
export type SetVotedOnProposalPayload = GovernanceTypes.SetVotedOnProposalPayload;

// Localization Types
export type LocaleData = LocalizationTypes.LocaleData;
export type LocalizationProps = LocalizationTypes.LocalizationProps;
export type SetSelectedLocalePayload = LocalizationTypes.SetSelectedLocalePayload;
export type StringGetterFunction = LocalizationTypes.StringGetterFunction;

// Local Storage Types
export type SetLocalStorageFunction = LocalStorageTypes.SetLocalStorageFunction;
export type GetLocalStorageFunction = LocalStorageTypes.GetLocalStorageFunction;
export type RemoveLocalStorageFunction = LocalStorageTypes.RemoveLocalStorageFunction;

// Modals Types
export type ModalConfig = ModalTypes.ModalConfig;
export type OpenModalPayload = ModalTypes.OpenModalPayload;
export type CloseModalPayload = ModalTypes.CloseModalPayload;

// Network Types
export type SetCurrentBlockNumberPayload = NetworkTypes.SetCurrentBlockNumberPayload;

// Notifications Types
export type AddNotificationPayload = NotificationTypes.AddNotificationPayload;
export type Notification = NotificationTypes.Notification;

export type ToastNotificationProps = {
  closeToast?: NoOpFunction;
  isToast?: boolean;
};

// Staking Pools Types
export type LiquidityPoolEpochData = StakingPoolsTypes.LiquidityPoolEpochData;
export type StakingPoolsData = StakingPoolsTypes.StakingPoolsData;
export type StakingPoolsDataState = StakingPoolsTypes.StakingPoolsDataState;
export type SetStakingPoolsDataPayload = StakingPoolsTypes.SetStakingPoolsDataPayload;
export type UpdateStakingPoolsDataPayload = StakingPoolsTypes.UpdateStakingPoolsDataPayload;

// Page Types
export type PageViewport = PageTypes.PageViewport;
export type PageSizeChangedPayload = PageTypes.PageSizeChangedPayload;

// Styles Types
export type Theme = StylesTypes.Theme;

// Trading Rewards Types
export type SetTradingRewardsDataPayload = TradingRewardsTypes.SetTradingRewardsDataPayload;
export type TradingRewardsData = TradingRewardsTypes.TradingRewardsData;

// Wallets Types
export type ConnectWalletOptions = WalletsTypes.ConnectWalletOptions;
export type ConnectWalletPayload = WalletsTypes.ConnectWalletPayload;
export type WalletLoadedPayload = WalletsTypes.WalletLoadedPayload;
export type DisconnectWalletPayload = WalletsTypes.DisconnectWalletPayload;
export type UserAccountChangedPayload = WalletsTypes.UserAccountChangedPayload;
export type NetworkIdChangedPayload = WalletsTypes.NetworkIdChangedPayload;
