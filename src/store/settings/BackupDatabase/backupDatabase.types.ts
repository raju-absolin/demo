import { BaseInitialState } from "@src/common/common.types";
import { CustomModalProps } from "@src/components/Modal";

export type backUpDataBaselist = {
  id:string,
  code: string,
  name: string,
  createdon: string
}

export type backUpDataBaseParams = {
  no_of_pages: number,
  page_size: number,
  page: number,
  search: string,
  currentSort: string,
  sortOrder: string,
}

export interface BackupDatabaseInitialState extends BaseInitialState {
  listCount: number;
  adminProfileList: Array<any>;
  adminListCount: number;
  backUpDataBaselist: backUpDataBaselist[],
  locationManagerData: {},
  backupData: any,
  passwordModel: boolean,
  dataBaseId: number,
  verifyPwdloading: boolean
  manualRegCount: number;
  checkedPermissions: {}[];
  model: boolean;
  loading: boolean;
  status: string;
  error: string;
  permissionsLoading: boolean;
  expanded: string | false[];
  modalProps: CustomModalProps;
}