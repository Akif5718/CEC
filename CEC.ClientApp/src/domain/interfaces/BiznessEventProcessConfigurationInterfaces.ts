export interface IBiznessEventProcessConfiguration {
  biznessEventProcessConfigurationId?: number;
  fixedTaskTemplateId?: number;
  biznessEventId?: number;
  controllerPath?: string;
  controllerParameter?: string;
  sequence?: number;
  isAction?: boolean;
  mailTemplate?: string;
  smsTemplate?: string;
  dateOfEntry?: string;
  enteredBy?: number;
}

export interface ICreateBiznessEventProcessConfiguration {
  fixedTaskTemplateId: number;
  biznessEventId: number;
  controllerPath: string;
  controllerParameter: string;
  sequence: number;
  isAction: boolean;
  mailTemplate: string;
  smsTemplate: string;
  dateOfEntry: string;
  enteredBy: number;
}

export interface IUpdateBiznessEventProcessConfiguration {
  biznessEventProcessConfigurationId: number;
  fixedTaskTemplateId: number;
  biznessEventId: number;
  controllerPath: string;
  controllerParameter: string;
  sequence: number;
  isAction: boolean;
  mailTemplate: string;
  smsTemplate: string;
  dateOfEntry: string;
  enteredBy: number;
}
export interface IDeleteBiznessEventProcessConfiguration {
  biznessEventProcessConfigurationId: number;
}

export interface IProcessBiznessEventProcessConfiguration {
  createCommand: ICreateBiznessEventProcessConfiguration[];
  updateCommand: IUpdateBiznessEventProcessConfiguration[];
  deleteCommand: IDeleteBiznessEventProcessConfiguration[];
}
