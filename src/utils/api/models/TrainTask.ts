import { BaseModel } from "./Base";
/**
 * 模型
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/workflow.py
 */
export interface TrainTask extends BaseModel {
  /**
   * 名称
   */
  name?: string;
  /**
   * 状态
   */
  status: number;
  /**
   * 模型
   */
  ai_model: number;
  /**
   * 模型名称
   */
  ai_model_name: string;
  /**
   * 计划
   */
  plan: number;
  /**
   * 计划名称
   */
  plan_name: string;
  /**
   * 完成时间
   */
  finished_datetime?: string;
  /**
   * 运行状态
   */
  running_status?: string;
  res_url?: string;
  log_url?: string;
}
