import { BaseModel } from "./Base";

export interface TrainTaskLog extends BaseModel {
  total_seconds: number;
  venv: number;
  venv_seconds: number;
  venv_start_datetime?: string;
  venv_end_datetime?: string;
  requirements: number;
  train: number;
  train_seconds: number;
  requirements_seconds: number;
}
