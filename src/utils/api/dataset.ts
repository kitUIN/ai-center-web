import {
  fetchGetDetail,
  fetchGetList,
  fetchPostCreate,
  fetchPostDelete,
  fetchPostUpdate,
} from "./BaseFetch";
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
 * 创建
 */
export async function datasetCreate(data: DataSet) {
  return fetchPostCreate(baseApi, data);
}
/**
 * 查询单个详情
 * @param id id
 */
export async function datasetDetail(id: ModelId) {
  return fetchGetDetail<DataSet>(baseApi, id);
}

/**
 * 更新单个
 * @param id id
 */
export async function datasetUpdate(id: ModelId, data: DataSet) {
  return fetchPostUpdate(baseApi, id, data);
}

/**
 * 删除单个
 * @param id id
 */
export async function datasetDelete(id: ModelId) {
  return fetchPostDelete<DataSet>(baseApi, id);
}
