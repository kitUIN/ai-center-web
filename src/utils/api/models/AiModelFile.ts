import { CenterFile } from "./CenterFile";
/**
 * 模型
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/center_file.py
 */
export interface AiModelFile extends CenterFile {
  /**
   * 模型id
   */
  ai_model: number;
}
