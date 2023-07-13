import { ModalType } from '@/enums';

export type ModalConfig = {
  type: ModalType;
  props?: object;
} | null;

export type OpenModalPayload = {
  type: ModalType;
  props?: object;
};

export type CloseModalPayload = {
  type?: ModalType;
};
