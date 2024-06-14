export interface IProcurementTenderDetail {
  procurementTenderDetailId: number | null;
  productGroupName: string | null;
  productGroupId: number | null;
  quantity: number | null;
  productName: string | null;
  productId: number | null;
  price: number | null;
  initialFactor: number | null;
  loading?: boolean | null;
}

export interface ICreateProcurementTenderDetailCommand {
  // procurementTenderDetailId: number;
  procurementTenderId: number | null;
  productGroupId: number;
  productId: number;
  quantity: number | null;
  price: number | null;
  initialFactor: number | null;
}

export interface IUpdateProcurementTenderDetailCommand {
  procurementTenderDetailId: number;
  procurementTenderId: number | null;
  productGroupId: number;
  productId: number;
  quantity: number | null;
  price: number | null;
  initialFactor: number | null;
}

export interface IDeleteProcurementTenderDetailCommand {
  procurementTenderDetailId: number;
}
