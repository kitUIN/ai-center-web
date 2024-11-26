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
  /**
   * key
   */
  key: string;
  tags: string[];
}
export const defaultAiModel: AiModel = {
  name: "",
  key: "",
  tags: [],
  create_datetime: null,
  update_datetime: null,
  id: null,
};
