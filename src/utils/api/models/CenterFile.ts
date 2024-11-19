import { BaseModel } from "./Base";
/**
 * 模型
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/center_file.py
 */
export interface CenterFile extends BaseModel {
  /**
   * 名称
   */
  file_name: string;
  /**
   * 路径
   */
  path?: string;
  /**
   * 存储方式
   */
  storage_method: number;
  /**
   * 路径
   */
  file: string;
}
