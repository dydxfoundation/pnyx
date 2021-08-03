import _ from 'lodash';

export const isErrorCancelError = ({ error }: { error: Error & { code?: number } }): boolean => {
  const { code, message } = error;

  /**
   * User rejected request RPC code
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#error-object-and-codes
   */
  if (code === 4001) {
    return true;
  }

  if (
    _.includes(message, 'User rejected the transaction') ||
    _.includes(message, 'User denied transaction signature') ||
    _.includes(message, 'User denied message signature') ||
    _.includes(message, 'Sign message cancelled') ||
    _.includes(message, 'User canceled') ||
    _.includes(message, 'cancelled')
  ) {
    return true;
  }

  return false;
};
