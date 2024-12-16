import { BaseModel, ModelId } from "./Base";
export interface AiModelPower extends BaseModel {
  /**
   * 名称
   */
  name: string;
  /**
   * 任务
   */
  task: ModelId;
  /**
   * 任务名称
   */
  task_name?: string;
  /**
   * 模型
   */
  ai_model: ModelId;
  /**
   * 模型名称
   */
  ai_model_name: string;
  /**
   * 是否已经配置
   */
  configured:boolean;
}
export interface AiModelPowerKey extends BaseModel{
    key:string
}