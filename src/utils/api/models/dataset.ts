import { BaseModel } from "./Base";
/**
 * 数据集
 * @link https://github.com/kitUIN/AiCenter/blob/master/center/models/dataset.py
 */
export interface DataSet extends BaseModel{
    /**
     * 名称
     */
    name:string;
    /**
     * 是否标注完成
     */
    status:boolean;
}