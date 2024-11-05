export type ModelId = string | number;
/**
 * 基础模型
 * @link https://github.com/kitUIN/AiCenter/blob/master/utils/base_model.py
 */
export interface BaseModel {
  /**
   * ID
   */
  id: ModelId;
  /**
   * 创建时间
   * 格式为: 2024-11-05 05:00:00
   */
  create_datetime: string;
  /**
   * 更新时间
   * 格式为: 2024-11-05 05:00:00
   */
  update_datetime: string;
}
