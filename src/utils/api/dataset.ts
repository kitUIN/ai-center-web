import { fetchGetDetail, fetchGetList, fetchPost } from "./BaseFetch";
import { ModelId } from "./models/Base";
import { DataSet } from "./models/DataSet";

const baseApi = "/dataset/";
/**
 * 查询列表
 */
export async function datasetList() {
  return fetchGetList<DataSet>(baseApi);
}
/**
 * 查询单个详情
 * @param id id
 */
export async function datasetDetail(id: ModelId) {
  return fetchGetDetail<DataSet>(`${baseApi}${id}/`);
}

/**
 * 更新单个
 * @param id id
 */
export async function datasetUpdate(id: ModelId, data: DataSet) {
  return fetchPost<DataSet>(
    `${baseApi}${id}/update/`,
    data as Record<string, unknown>
  );
}

/**
 * 删除单个
 * @param id id
 */
export async function datasetDelete(id: ModelId) {
  return fetchPost<DataSet>(`${baseApi}${id}/delete/`);
}
