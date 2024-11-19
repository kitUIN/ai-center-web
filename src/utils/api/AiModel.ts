import {
  DetailResponse,
  fetchGetDetail,
  fetchGetList,
  fetchPost,
  fetchPostCreate,
  fetchPostDelete,
  fetchPostUpdate,
} from "./BaseFetch";
import { ModelId } from "./models/Base";
import { AiModel } from "./models/AiModel";
import { AiModelFile } from "./models/AiModelFile";

const baseApi = "/ai/";
/**
 * 查询列表
 */
export async function aiList(page: number = 1, limit: number = 20) {
  return fetchGetList<AiModel>(baseApi, {
    page: page,
    limit: limit,
  });
}
/**
 * 创建
 */
export async function aiCreate(data: AiModel) {
  return fetchPostCreate(baseApi, data);
}
/**
 * 查询单个详情
 * @param id id
 */
export async function aiDetail(id: ModelId) {
  return fetchGetDetail<AiModel>(baseApi, id);
}

/**
 * 更新单个
 * @param id id
 */
export async function aiUpdate(id: ModelId, data: AiModel) {
  return fetchPostUpdate(baseApi, id, data);
}

/**
 * 删除单个
 * @param id id
 */
export async function aiDelete(id: ModelId) {
  return fetchPostDelete<AiModel>(baseApi, id);
}
/**
 * 查询文件列表
 */
export async function aiFileList(
  id: ModelId,
  page: number = 1,
  limit: number = 20
) {
  return fetchGetList<AiModelFile>(`${baseApi}/${id}/file`, {
    page: page,
    limit: limit,
  });
}
/**
 * 删除单个文件
 * @param id id
 */
export async function aiFileDelete(id: ModelId, file_id: ModelId) {
  return fetchPost<DetailResponse<AiModelFile>>(`/api${baseApi}${id}/file/${file_id}/delete/`);
}
