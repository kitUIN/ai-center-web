import { BaseModel } from "./Base";
/**
 * 模型
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/ai.py
 */
export interface AiModel extends BaseModel {
  /**
   * 名称
   */
  name: string;
}
export const defaultAiModel: AiModel = {
  name: "",
  create_datetime: null,
  update_datetime: null,
  id: null,
};
