import { JugendberufshilfenModel } from './JugendberufshilfenModel';
import { KindertageseinrichtungenModel } from './KindertageseinrichtungenModel';
import { SchulenModel } from './SchulenModel';
import { SchulsozialarbeitModel } from './SchulsozialarbeitModel';

export interface SearchRequestModel {
  isSchulsozialarbeit: boolean;
  isSchulen: boolean;
  isKindertageseinrichtungen: boolean;
  isJugendberufshilfen: boolean;
  isFavourite: boolean;
}
export interface SearchResponseModel {
  jugendberufshilfen: JugendberufshilfenModel[];
  kindertageseinrichtungen: KindertageseinrichtungenModel[];
  schulen: SchulenModel[];
  schulsozialarbeit: SchulsozialarbeitModel[];
}
