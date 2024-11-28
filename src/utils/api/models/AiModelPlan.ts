import { BaseModel, ModelId } from "./Base";
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
  ai_model: ModelId;
  /**
   * 依赖文件
   */
  requirements: ModelId;
  /**
   * 启动命令
   */
  startup: string;
  /**
   * 参数
   */
  args: string;
}
export const defaultAiModelPlan: AiModelPlan = {
  name: "",
  create_datetime: null,
  update_datetime: null,
  id: null,
  requirements:null,
  ai_model: 0,
  startup: "",
  args: "{}"
};
