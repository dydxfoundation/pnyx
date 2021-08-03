/* eslint-disable @typescript-eslint/no-explicit-any */

export type SetLocalStorageFunction = ({ key, value }: { key: string; value: any }) => void;
export type GetLocalStorageFunction = ({ key }: { key: string }) => any;
export type RemoveLocalStorageFunction = ({ key }: { key: string }) => void;
