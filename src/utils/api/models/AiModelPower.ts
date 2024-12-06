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
   * 依赖文件
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
}
export interface AiModelPowerKey extends BaseModel{
    key:string
}