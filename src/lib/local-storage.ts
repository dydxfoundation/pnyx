import {
  SetLocalStorageFunction,
  GetLocalStorageFunction,
  RemoveLocalStorageFunction,
} from '@/types';

export const LOCAL_STORAGE_KEYS = {
  ACKNOWLEDGE_TERMS_LIQUIDITY_POOL: 'ACKNOWLEDGE_TERMS_LIQUIDITY_POOL',
  ACKNOWLEDGE_TERMS_STAKING_POOL: 'ACKNOWLEDGE_TERMS_STAKING_POOL',
  LAST_WALLET_USED: 'LAST_WALLET_USED',
  SELECTED_LOCALE: 'SELECTED_LOCALE',
  WALLETCONNECT2_SESSION_TOPIC: 'WALLETCONNECT2_SESSION_TOPIC',
};

export const setLocalStorage: SetLocalStorageFunction = ({ key, value }) => {
  const serialized = JSON.stringify(value);

  try {
    window.localStorage.setItem(key, serialized);
  } catch (e) {
    // User doesn't have local storage
  }
};

export const getLocalStorage: GetLocalStorageFunction = ({ key }) => {
  let deserialized;

  try {
    let value: string | null;
    try {
      value = window.localStorage.getItem(key);
    } catch (e) {
      // User doesn't have local storage
      return null;
    }
    deserialized = JSON.parse(value!);
  } catch (error) {
    return null;
  }

  return deserialized;
};

export const removeLocalStorage: RemoveLocalStorageFunction = ({ key }) => {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    // User doesn't have local storage
  }
};
