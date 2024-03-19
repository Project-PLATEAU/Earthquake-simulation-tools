import { RecoilEnv } from 'recoil';

// Recoilのアトムの重複チェックを無効化
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export type BaseInformationProperty = {
  locationName: string;
  startDate: string;
  endDate: string;
  altitude: number;
  description: string;
  downloadUrl: string;
  dataUrl: string;
};