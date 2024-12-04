import { BaseModel } from "./Base";
import { TrainTask } from "./TrainTask";



export interface TrainTaskStep extends BaseModel {
  seconds: number;
  status: number;
  start_datetime?: string;
  end_datetime?: string;
  name: string;
}
export interface TrainTaskLog extends TrainTask{
  total_seconds:number,
  steps: TrainTaskStep[]
}
export interface TrainTaskLogDetail {
  pos: number;
  log_type: string;
  lines: string[];
}
