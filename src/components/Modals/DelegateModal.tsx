import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ethers } from 'ethers';

import {
  AssetSymbol,
  DelegatePowersOption,
  DocumentationSublinks,
  ExternalLink,
  NotificationType,
} from '@/enums';

import { AppDispatch, RootState } from '@/store';
import { DelegatePowersTxHashes, LocalizationProps } from '@/types';

import { breakpoints, fontSizes } from '@/styles';
import { withLocalization } from '@/hoc';
import { CloseIcon } from '@/icons';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import LearnMoreLink from '@/components/LearnMoreLink';
import LoadingSpace from '@/components/LoadingSpace';
import InputField, { InputFieldType } from '@/components/InputField';

import AlertMessage, { AlertMessageType } from '@/components/AlertMessage';
import WithLabel, { WithLabelColor } from '@/components/WithLabel';
import { Modal, ModalHeader, ModalSize, ModalContentContainer } from '@/components/Modals';

import { addNotification as addNotificationAction } from '@/actions/notifications';

import { getStakingBalancesData, getWalletBalancesData } from '@/selectors/balances';
import { getGovernancePowersData } from '@/selectors/governance';
import { getIsWalletIncorrectNetwork, getWalletAddress } from '@/selectors/wallets';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';
import { isErrorCancelError } from '@/lib/wallets';

import {
  findAllPowersDelegatee,
  findVotingPowerDelegatee,
  findProposingPowerDelegatee,
} from '@/lib/governance';

export type DelegateModalProps = { closeModal: () => void } & LocalizationProps;

export type ConnectedDelegateModalProps = DelegateModalProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const defaultAddressInputPlaceholder = '0x1234...6789';

export const UnconnectedDelegateModal: React.FC<ConnectedDelegateModalProps> = ({
  addNotification,
  closeModal,
  governancePowersData,
  isWalletIncorrectNetwork,
  stringGetter,
  walletAddress,
  walletBalancesData,
}) => {
  const [
    selectedDelegatePowersOption,
    setSelectedDelegatePowersOption,
  ] = useState<DelegatePowersOption>(DelegatePowersOption.Both);

  const [userHasDelegateesForOption, setUserHasDelegateesForOption] = useState<boolean>(false);

  const [isCtaLoading, setIsCtaLoading] = useState<boolean>(false);
  const [walletErrorMessage, setWalletErrorMessage] = useState<string | undefined>();

  const [delegateeAddressInput, setDelegateeAddressInput] = useState<string>('');
  const [delegateToSelf, setDelegateToSelf] = useState<boolean>(false);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(defaultAddressInputPlaceholder);

  const [isAddressInputCurrentDelegatee, setIsAddressInputCurrentDelegatee] = useState<boolean>(
    false
  );

  const [selectedDydxTokens, setSelectedDydxTokens] = useState<boolean>(false);
  const [selectedStakedDydxTokens, setSelectedStakedDydxTokens] = useState<boolean>(false);

  const {
    delegateeAddress: allPowersDelegateeAddress,
    hasDelegatees: allPowersHasDelegatees,
  } = findAllPowersDelegatee({
    forStakedTokenPowers: selectedStakedDydxTokens,
    forTokenPowers: selectedDydxTokens,
    governancePowersData,
    walletAddress,
  });

  const {
    delegateeAddress: proposingPowerDelegateeAddress,
    hasDelegatees: proposingPowerHasDelegatees,
  } = findProposingPowerDelegatee({
    forStakedTokenPowers: selectedStakedDydxTokens,
    forTokenPowers: selectedDydxTokens,
    governancePowersData,
    walletAddress,
  });

  const {
    delegateeAddress: votingPowerDelegateeAddress,
    hasDelegatees: votingPowerHasDelegatees,
  } = findVotingPowerDelegatee({
    forStakedTokenPowers: selectedStakedDydxTokens,
    forTokenPowers: selectedDydxTokens,
    governancePowersData,
    walletAddress,
  });

  useEffect(() => {
    const userHasTokenBalance = !MustBigNumber(
      walletBalancesData[AssetSymbol.DYDX].balance
    ).isZero();

    if (userHasTokenBalance) {
      setSelectedDydxTokens(true);
    }

    const userHasStakedTokenbalance = !MustBigNumber(
      walletBalancesData[AssetSymbol.stDYDX].balance
    ).isZero();

    if (userHasStakedTokenbalance) {
      setSelectedStakedDydxTokens(true);
    }
  }, []);

  useEffect(() => {
    setIsAddressInputCurrentDelegatee(true);

    switch (selectedDelegatePowersOption) {
      case DelegatePowersOption.Both: {
        setDelegateeAddressInput(allPowersDelegateeAddress || '');
        setUserHasDelegateesForOption(allPowersHasDelegatees);

        setInputPlaceholder(
          !allPowersDelegateeAddress && allPowersHasDelegatees
            ? stringGetter({
                key: STRING_KEYS.MIXED_ADDRESSES,
              })
            : defaultAddressInputPlaceholder
        );

        break;
      }
      case DelegatePowersOption.Voting: {
        setDelegateeAddressInput(votingPowerDelegateeAddress || '');
        setUserHasDelegateesForOption(votingPowerHasDelegatees);

        setInputPlaceholder(
          !votingPowerDelegateeAddress && votingPowerHasDelegatees
            ? stringGetter({
                key: STRING_KEYS.MIXED_ADDRESSES,
              })
            : defaultAddressInputPlaceholder
        );

        break;
      }
      case DelegatePowersOption.Proposing: {
        setDelegateeAddressInput(proposingPowerDelegateeAddress || '');
        setUserHasDelegateesForOption(proposingPowerHasDelegatees);

        setInputPlaceholder(
          !proposingPowerDelegateeAddress && proposingPowerHasDelegatees
            ? stringGetter({
                key: STRING_KEYS.MIXED_ADDRESSES,
              })
            : defaultAddressInputPlaceholder
        );

        break;
      }
      default: {
        break;
      }
    }
  }, [
    allPowersDelegateeAddress,
    allPowersHasDelegatees,
    proposingPowerDelegateeAddress,
    proposingPowerHasDelegatees,
    votingPowerDelegateeAddress,
    votingPowerHasDelegatees,
    selectedDelegatePowersOption,
  ]);

  const onChangeAddressInput = (newValue: string) => {
    setWalletErrorMessage(undefined);

    setDelegateeAddressInput(newValue);
    setDelegateToSelf(false);

    switch (selectedDelegatePowersOption) {
      case DelegatePowersOption.Both: {
        setIsAddressInputCurrentDelegatee(
          newValue.toLowerCase() === allPowersDelegateeAddress?.toLowerCase()
        );
        break;
      }
      case DelegatePowersOption.Voting: {
        setIsAddressInputCurrentDelegatee(
          newValue.toLowerCase() === votingPowerDelegateeAddress?.toLowerCase()
        );
        break;
      }
      case DelegatePowersOption.Proposing: {
        setIsAddressInputCurrentDelegatee(
          newValue.toLowerCase() === proposingPowerDelegateeAddress?.toLowerCase()
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  const onClickDelegate = async () => {
    try {
      setIsCtaLoading(true);

      const delegatee = delegateToSelf ? (walletAddress as string) : delegateeAddressInput;

      let txHashes: DelegatePowersTxHashes = {};

      switch (selectedDelegatePowersOption) {
        case DelegatePowersOption.Both: {
          txHashes = await contractClient.governanceClient.delegateAllPowers({
            delegatee,
            delegateStakedToken: selectedStakedDydxTokens,
            delegateToken: selectedDydxTokens,
            walletAddress: walletAddress as string,
          });
          break;
        }
        case DelegatePowersOption.Voting: {
          txHashes = await contractClient.governanceClient.delegateVotingPower({
            delegatee,
            delegateStakedToken: selectedStakedDydxTokens,
            delegateToken: selectedDydxTokens,
            walletAddress: walletAddress as string,
          });
          break;
        }
        case DelegatePowersOption.Proposing: {
          txHashes = await contractClient.governanceClient.delegateProposingPower({
            delegatee,
            delegateStakedToken: selectedStakedDydxTokens,
            delegateToken: selectedDydxTokens,
            walletAddress: walletAddress as string,
          });
          break;
        }
        default: {
          break;
        }
      }

      if (txHashes.delegateStakedTokenTxHash) {
        addNotification({
          notificationType: NotificationType.Delegate,
          notificationData: {
            txHash: txHashes.delegateStakedTokenTxHash,
            isStakedToken: true,
            isUndelegatePower: delegateToSelf,
          },
        });
      }

      if (txHashes.delegateTokenTxHash) {
        addNotification({
          notificationType: NotificationType.Delegate,
          notificationData: {
            txHash: txHashes.delegateTokenTxHash,
            isUndelegatePower: delegateToSelf,
          },
        });
      }

      closeModal();
    } catch (error) {
      console.error(error);

      if (!isErrorCancelError({ error })) {
        setWalletErrorMessage(error.message || stringGetter({ key: STRING_KEYS.UNKNOWN_ERROR }));
      }
    } finally {
      setIsCtaLoading(false);
    }
  };

  const userHasBothTokens =
    !MustBigNumber(walletBalancesData[AssetSymbol.DYDX].balance).isZero() &&
    !MustBigNumber(walletBalancesData[AssetSymbol.stDYDX].balance).isZero();

  const isAddressFormatInvalid =
    delegateeAddressInput !== '' && !ethers.utils.isAddress(delegateeAddressInput);

  const isAddressOwnAddress = delegateeAddressInput.toLowerCase() === walletAddress?.toLowerCase();
  const addressInputIsInvalid = isAddressFormatInvalid || isAddressOwnAddress;

  let errorMessage;
  if (isWalletIncorrectNetwork) {
    errorMessage = stringGetter({ key: STRING_KEYS.WRONG_NETWORK });
  } else if (isAddressFormatInvalid) {
    errorMessage = stringGetter({ key: STRING_KEYS.INVALID_ETHEREUM_ADDRESS });
  } else if (isAddressOwnAddress) {
    errorMessage = stringGetter({ key: STRING_KEYS.ADDRESS_IS_OWN_ADDRESS });
  }

  let addressInputPlaceholder = inputPlaceholder;
  if (delegateToSelf) {
    addressInputPlaceholder = stringGetter({
      key:
        selectedDelegatePowersOption === DelegatePowersOption.Both
          ? STRING_KEYS.UNDELEGATE_POWERS
          : STRING_KEYS.UNDELEGATE_POWER,
    });
  }

  return (
    <Modal size={ModalSize.Medium}>
      {!walletBalancesData[AssetSymbol.DYDX].balance ||
      !walletBalancesData[AssetSymbol.stDYDX].balance ? (
        <LoadingSpace minHeight={16} />
      ) : (
        <>
          <ModalHeader
            noBorder
            title={stringGetter({ key: STRING_KEYS.DELEGATE_POWERS })}
            subtitle={
              <>
                {stringGetter({ key: STRING_KEYS.DELEGATE_POWERS_DESCRIPTION })}{' '}
                <LearnMoreLink
                  href={`${ExternalLink.Documentation}${DocumentationSublinks.Voting}`}
                />
              </>
            }
          />
          <ModalContentContainer>
            <PowerSelector>
              <PowerSelectorOption
                active={selectedDelegatePowersOption === DelegatePowersOption.Both}
                onClick={() => {
                  setSelectedDelegatePowersOption(DelegatePowersOption.Both);
                  setDelegateToSelf(false);
                }}
              >
                {stringGetter({ key: STRING_KEYS.BOTH })}
              </PowerSelectorOption>
              <PowerSelectorOption
                active={selectedDelegatePowersOption === DelegatePowersOption.Proposing}
                onClick={() => {
                  setSelectedDelegatePowersOption(DelegatePowersOption.Proposing);
                  setDelegateToSelf(false);
                }}
              >
                {stringGetter({ key: STRING_KEYS.PROPOSING })}
              </PowerSelectorOption>
              <PowerSelectorOption
                active={selectedDelegatePowersOption === DelegatePowersOption.Voting}
                onClick={() => {
                  setSelectedDelegatePowersOption(DelegatePowersOption.Voting);
                  setDelegateToSelf(false);
                }}
              >
                {stringGetter({ key: STRING_KEYS.VOTING })}
              </PowerSelectorOption>
            </PowerSelector>
            <WithLabel
              noMargin
              color={WithLabelColor.Base}
              label={stringGetter({ key: STRING_KEYS.WALLET_ADDRESS })}
            >
              <InputField
                enableSpellCheck={false}
                handleChange={onChangeAddressInput}
                iconButtonConfig={
                  userHasDelegateesForOption && !delegateToSelf
                    ? {
                        icon: (
                          <ClearAddressIcon>
                            <CloseIcon />
                          </ClearAddressIcon>
                        ),
                        onClickIcon: () => {
                          setDelegateToSelf(true);
                          setDelegateeAddressInput('');
                        },
                      }
                    : undefined
                }
                placeholder={addressInputPlaceholder}
                type={InputFieldType.Text}
                value={delegateeAddressInput}
              />
            </WithLabel>
            {(errorMessage || walletErrorMessage) && (
              <AlertMessage
                type={AlertMessageType.Error}
                message={
                  walletErrorMessage
                    ? stringGetter({
                        key: STRING_KEYS.SOMETHING_WENT_WRONG,
                        params: { ERROR_MESSAGE: walletErrorMessage },
                      })
                    : errorMessage
                }
              />
            )}
            {userHasBothTokens && (
              <TokenSelectSection>
                <WithLabel
                  noMargin
                  color={WithLabelColor.Base}
                  label={stringGetter({ key: STRING_KEYS.TOKENS })}
                >
                  <CheckboxContainer>
                    <Checkbox
                      checked={selectedDydxTokens}
                      label={AssetSymbol.DYDX}
                      onClick={() => {
                        setWalletErrorMessage(undefined);
                        setDelegateToSelf(false);
                        setSelectedDydxTokens(!selectedDydxTokens);
                      }}
                    />
                    <Checkbox
                      checked={selectedStakedDydxTokens}
                      label={stringGetter({
                        key: STRING_KEYS.STAKED_SYMBOL,
                        params: { SYMBOL: AssetSymbol.DYDX },
                      })}
                      onClick={() => {
                        setWalletErrorMessage(undefined);
                        setDelegateToSelf(false);
                        setSelectedStakedDydxTokens(!selectedStakedDydxTokens);
                      }}
                    />
                  </CheckboxContainer>
                </WithLabel>
              </TokenSelectSection>
            )}
            {userHasBothTokens && selectedDydxTokens && selectedStakedDydxTokens && (
              <AlertMessage
                type={AlertMessageType.Warning}
                message={stringGetter({ key: STRING_KEYS.TWO_TOKEN_DELEGATION_TRANSACTION })}
              />
            )}
            <ButtonContainer>
              <Button
                fullWidth
                isLoading={isCtaLoading}
                onClick={onClickDelegate}
                disabled={
                  !delegateToSelf &&
                  (delegateeAddressInput === '' ||
                    addressInputIsInvalid ||
                    isAddressInputCurrentDelegatee ||
                    (!selectedDydxTokens && !selectedStakedDydxTokens))
                }
              >
                {stringGetter({
                  key: delegateToSelf ? STRING_KEYS.UNDELEGATE : STRING_KEYS.DELEGATE,
                })}
              </Button>
            </ButtonContainer>
          </ModalContentContainer>
        </>
      )}
    </Modal>
  );
};

const TokenSelectSection = styled.div`
  margin-top: 0.75rem;
`;

const CheckboxContainer = styled.div`
  margin: 0.75rem 0 0.25rem;

  > div {
    display: inline-flex;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

const ButtonContainer = styled.div`
  margin-top: 0.75rem;
`;

const PowerSelector = styled.div`
  ${fontSizes.size14}
  display: flex;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.layermediumlight};
  height: 2.5rem;
  margin-bottom: 1rem;
  user-select: none;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
    height: 3rem;
  }
`;

const PowerSelectorOption = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  height: 100%;
  padding: 0 1rem;
  cursor: pointer;
  border-radius: 0.5rem;

  @media ${breakpoints.tablet} {
    padding: 0 0.75rem;
  }

  color: ${(props) => (props.active ? props.theme.textlight : props.theme.textdark)};
  background-color: ${(props) =>
    props.active ? props.theme.layerlighter : props.theme.layermediumlight};
`;

const ClearAddressIcon = styled.div`
  display: flex;
  align-items: center;

  > svg path {
    stroke: ${({ theme }) => theme.colorred};
  }
`;

const mapStateToProps = (state: RootState) => ({
  governancePowersData: getGovernancePowersData(state),
  isWalletIncorrectNetwork: getIsWalletIncorrectNetwork(state),
  stakingBalancesData: getStakingBalancesData(state),
  walletAddress: getWalletAddress(state),
  walletBalancesData: getWalletBalancesData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      addNotification: addNotificationAction,
    },
    dispatch
  );

export default withLocalization<DelegateModalProps>(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedDelegateModal)
);
