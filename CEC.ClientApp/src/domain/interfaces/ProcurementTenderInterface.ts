import {
  ICreateProcurementTenderAdditionalCostCommand,
  IDeleteProcurementTenderAdditionalCostCommand,
  IUpdateProcurementTenderAdditionalCostCommand,
} from './ProcurementTenderAdditionalCost';
import {
  ICreateProcurementTenderDetailCommand,
  IDeleteProcurementTenderDetailCommand,
  IUpdateProcurementTenderDetailCommand,
} from './ProcurementTenderDetailInterface';

export interface IProcurementTender {
  procurementTenderId?: number;
  tenderNo?: string | null;
  tenderEntryDate?: string | null;
  buyerId?: number | null;
  buyerName?: string | null;
  bgAmount?: number | null;
  salesPersonId?: number | null;
  salesPersonName?: string | null;
  remarks?: string | null;
  tenderSubmissionDate?: string | null;
  schedulePrice?: number | null;
}

export interface ITenderNoComboBox {
  procurementTenderId: number;
  tenderNo: string;
}

export interface ITenderHistory {
  noOfTender: number;
  noOfTenderWin: number;
  averageValue: number | null;
  lastTenderNo: string;
  date: string | null;
  salesPerson: string;
  lastTenderAmount: number | null;
}

export interface ICreateProcurementTenderCommand {
  procurementTenderId: number | null;
  tenderNo: string | null;
  tenderEntryDate: string | null;
  buyerId: number | null;
  bgAmount: number | null;
  salesPersonId: number | null;
  remarks: string | null;
  tenderSubmissionDate: string | null;
  schedulePrice: number | null;
}

export interface IUpdateProcurementTenderCommand {
  procurementTenderId: number;
  tenderNo: string;
  tenderEntryDate: string | null;
  buyerId: number | null;
  bgAmount: number | null;
  salesPersonId: number | null;
  remarks: string | null;
  tenderSubmissionDate: string | null;
  schedulePrice: number | null;
}

export interface IDeleteProcurementTenderCommand {
  procurementTenderId: number;
}

export interface IProcurementTenderProcessCommandsVM {
  createProcurementTenderCommand: ICreateProcurementTenderCommand | null;
  updateProcurementTenderCommand: IUpdateProcurementTenderCommand | null;
  deleteProcurementTenderCommand: IDeleteProcurementTenderCommand | null;
  createProcurementTenderDetailCommand: ICreateProcurementTenderDetailCommand[];
  updateProcurementTenderDetailCommand: IUpdateProcurementTenderDetailCommand[];
  deleteProcurementTenderDetailCommand: IDeleteProcurementTenderDetailCommand[];
  createProcurementTenderAdditionalCostCommand: ICreateProcurementTenderAdditionalCostCommand[];
  updateProcurementTenderAdditionalCostCommand: IUpdateProcurementTenderAdditionalCostCommand[];
  deleteProcurementTenderAdditionalCostCommand: IDeleteProcurementTenderAdditionalCostCommand[];
}
