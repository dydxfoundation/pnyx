import { GovernancePowersData } from '@/types';

enum TokenKey {
  StakedToken = 'STAKED_TOKEN',
  Token = 'TOKEN',
}

enum DelegateePowerKey {
  Proposition = 'PROPOSITION_DELEGATEE',
  Voting = 'VOTING_DELEGATEE',
}

type DelegateeAddress = string | undefined;

type FindDelegateeReturnPayload = {
  delegateeAddress: DelegateeAddress;
  hasDelegatees: boolean;
};

const findDelegateeByTokenAndPower = ({
  delegateePowerKey,
  governancePowersData,
  tokenKey,
}: {
  delegateePowerKey: DelegateePowerKey;
  governancePowersData: GovernancePowersData;
  tokenKey: TokenKey;
}): DelegateeAddress => {
  const delegateeData = governancePowersData.delegatees?.[tokenKey];

  if (delegateeData) {
    return delegateeData[delegateePowerKey].toLowerCase();
  }

  return undefined;
};

export const findDelegateeByPower = ({
  delegateePowerKey,
  forStakedTokenPowers,
  forTokenPowers,
  governancePowersData,
  walletAddress,
}: {
  delegateePowerKey: DelegateePowerKey;
  forStakedTokenPowers: boolean;
  forTokenPowers: boolean;
  governancePowersData: GovernancePowersData;
  walletAddress: string | undefined;
}): FindDelegateeReturnPayload => {
  if (!walletAddress) {
    return {
      delegateeAddress: undefined,
      hasDelegatees: false,
    };
  }

  const lowercaseWalletAddress = walletAddress.toLowerCase();

  /** Track if account has any delegatees for voting power at all */
  let hasDelegatees = false;

  let delegateeAddress: string | undefined;

  /**
   * Check voting power for the relevant tokens and save the address only if the address
   * matches for each token.
   */
  if (forStakedTokenPowers) {
    const address = findDelegateeByTokenAndPower({
      delegateePowerKey,
      governancePowersData,
      tokenKey: TokenKey.StakedToken,
    });

    if (address && address !== lowercaseWalletAddress) {
      hasDelegatees = true;
      delegateeAddress = address;
    }
  }

  if (forTokenPowers) {
    const address = findDelegateeByTokenAndPower({
      delegateePowerKey,
      governancePowersData,
      tokenKey: TokenKey.Token,
    });

    /**
     * Check to make sure delegateAddress matches current address if address exists. Otherwise,
     * just set delegateeAddress to undefined.
     */
    if (address && address !== lowercaseWalletAddress) {
      hasDelegatees = true;

      /**
       * If staked token powers is not considered, set delegateAddress. Otherwise, if delegatee
       * addresses don't match across tokens, don't return an address.
       * */
      if (!forStakedTokenPowers) {
        delegateeAddress = address;
      } else if (delegateeAddress !== address) {
        delegateeAddress = undefined;
      }
    } else {
      delegateeAddress = undefined;
    }
  }

  return {
    delegateeAddress,
    hasDelegatees,
  };
};

export const findVotingPowerDelegatee = ({
  forStakedTokenPowers,
  forTokenPowers,
  governancePowersData,
  walletAddress,
}: {
  forStakedTokenPowers: boolean;
  forTokenPowers: boolean;
  governancePowersData: GovernancePowersData;
  walletAddress: string | undefined;
}): FindDelegateeReturnPayload =>
  findDelegateeByPower({
    delegateePowerKey: DelegateePowerKey.Voting,
    forStakedTokenPowers,
    forTokenPowers,
    governancePowersData,
    walletAddress,
  });

export const findProposingPowerDelegatee = ({
  forStakedTokenPowers,
  forTokenPowers,
  governancePowersData,
  walletAddress,
}: {
  forStakedTokenPowers: boolean;
  forTokenPowers: boolean;
  governancePowersData: GovernancePowersData;
  walletAddress: string | undefined;
}): FindDelegateeReturnPayload =>
  findDelegateeByPower({
    delegateePowerKey: DelegateePowerKey.Proposition,
    forStakedTokenPowers,
    forTokenPowers,
    governancePowersData,
    walletAddress,
  });

export const findAllPowersDelegatee = ({
  forStakedTokenPowers,
  forTokenPowers,
  governancePowersData,
  walletAddress,
}: {
  forStakedTokenPowers: boolean;
  forTokenPowers: boolean;
  governancePowersData: GovernancePowersData;
  walletAddress: string | undefined;
}): FindDelegateeReturnPayload => {
  const {
    delegateeAddress: proposingPowerDelegateeAddress,
    hasDelegatees: proposingPowerHasDelegatees,
  } = findProposingPowerDelegatee({
    forStakedTokenPowers,
    forTokenPowers,
    governancePowersData,
    walletAddress,
  });

  const {
    delegateeAddress: votingPowerDelegateeAddress,
    hasDelegatees: votingPowerHasDelegatees,
  } = findVotingPowerDelegatee({
    forStakedTokenPowers,
    forTokenPowers,
    governancePowersData,
    walletAddress,
  });

  /** Only return delegateeAddress if all delegatees match up across all powers and tokens */
  if (
    proposingPowerHasDelegatees &&
    votingPowerHasDelegatees &&
    proposingPowerDelegateeAddress === votingPowerDelegateeAddress
  ) {
    return {
      delegateeAddress: proposingPowerDelegateeAddress,
      hasDelegatees: true,
    };
  }

  return {
    delegateeAddress: undefined,
    hasDelegatees: proposingPowerHasDelegatees || votingPowerHasDelegatees,
  };
};
