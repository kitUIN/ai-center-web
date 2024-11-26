export interface StartupData {
  value: string;
  allow_modify: boolean;
}
export interface ArgData {
  id:number;
  value: string;
  allow_modify: boolean;
  name: string;
  type: "string" | "file";
  info?: string;
  [key: string]: unknown;
}

export interface TrainPlanTemplate {
  args: ArgData[];
  startup: StartupData;
}
