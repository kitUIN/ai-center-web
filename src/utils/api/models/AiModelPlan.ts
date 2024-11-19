import { BaseModel } from "./Base";
/**
 * 模型
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/center_file.py
 */
export interface AiModelPlan extends BaseModel {
  /**
   * 名称
   */
  name: string;
  /**
   * 模型id
   */
  ai_model: number;
  /**
   * 启动命令
   */
  startup: string;
  /**
   * 参数
   */
  args: string;
}
