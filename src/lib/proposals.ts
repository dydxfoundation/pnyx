import { ProposalStatus } from '@/enums';
import { STRING_KEYS } from '@/constants/localization';

export const getStatusLabelKey = ({ status }: { status: ProposalStatus }): string | null => {
  let statusLabelKey;

  switch (status) {
    case ProposalStatus.Active: {
      statusLabelKey = STRING_KEYS.ACTIVE;
      break;
    }
    case ProposalStatus.Canceled: {
      statusLabelKey = STRING_KEYS.CANCELED;
      break;
    }
    case ProposalStatus.Executed: {
      statusLabelKey = STRING_KEYS.EXECUTED;
      break;
    }
    case ProposalStatus.Failed: {
      statusLabelKey = STRING_KEYS.FAILED;
      break;
    }
    case ProposalStatus.Pending: {
      statusLabelKey = STRING_KEYS.PENDING;
      break;
    }
    case ProposalStatus.Queued: {
      statusLabelKey = STRING_KEYS.QUEUED;
      break;
    }
    case ProposalStatus.Succeeded: {
      statusLabelKey = STRING_KEYS.SUCCEEDED;
      break;
    }
    default: {
      statusLabelKey = null;
      break;
    }
  }

  return statusLabelKey;
};

export const getTotalRequiredVotes = ({
  againstVotes,
  forVotes,
  minimumDiff,
  minimumQuorum,
}: {
  againstVotes: number;
  forVotes: number;
  minimumDiff: number;
  minimumQuorum: number;
}): number => {
  /**
   * Unless the vote is close, total votes will just be minimumQuorum * 2
   * (total votes required on either side to win * 2) or total of all votes.
   * */
  let totalVotes = Math.max(minimumQuorum * 2, againstVotes + forVotes);
  const voteDiff = Math.abs(againstVotes - forVotes);

  /**
   * If minimumQuorum has been hit on either side, but the minimumDiff has not, calculate
   * the total votes based on how many more votes each side will need to win.
   * */
  if (voteDiff < minimumDiff && (againstVotes >= minimumQuorum || forVotes >= minimumQuorum)) {
    /** First add total votes + required votes for winning side to win */
    totalVotes = againstVotes + forVotes + voteDiff;

    /** Then add total votes required for other side to win */
    totalVotes += Math.abs(againstVotes - forVotes) + minimumDiff;
  }

  return totalVotes;
};
