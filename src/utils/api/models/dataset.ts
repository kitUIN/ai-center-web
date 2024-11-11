import { BaseModel } from "./Base";
/**
 * 数据集
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/dataset.py
 */
export interface DataSet extends BaseModel {
  /**
   * 名称
   */
  name: string;
  /**
   * 是否标注完成
   */
  status: boolean;
  /**
   * 描述
   */
  description: string;
  /**
   * 总任务数量
   */
  task_number: number;
  /**
   * 完成任务数量
   */
  finished_task_number: number;
  /**
   * 预测数量
   */
  total_predictions_number: number;
  /**
   * 标注完成数量
   */
  total_annotations_number: number;
  /**
   * 跳过数量
   */
  skipped_annotations_number: number;
  /**
   * 跳转链接
   */
  middle_url?: string;
}
export const defaultDataSet: DataSet = {
  name: "",
  description: "",
  create_datetime: null,
  update_datetime: null,
  id: null,
  total_annotations_number: 0,
  total_predictions_number: 0,
  task_number: 0,
  finished_task_number: 0,
  status: false,
  skipped_annotations_number: 0,
};
