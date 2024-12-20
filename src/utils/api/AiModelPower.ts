import {
  DetailResponse,
  fetchGet,
  fetchGetDetail,
  fetchGetList,
  fetchPost,
  fetchPostCreate,
  fetchPostDelete,
  fetchPostUpdate,
} from "./BaseFetch";
import {
  AiModelPower,
  AiModelPowerDetail,
  AiModelPowerKey,
} from "./models/AiModelPower";
import { ModelId } from "./models/Base";
import { ArgData } from "./models/PlanTemplate";

const baseApi = "/ai/power/";
/**
 * 查询列表
 */
export async function aiPowerList(page: number = 1, limit: number = 20) {
  return fetchGetList<AiModelPower>(baseApi, {
    page: page,
    limit: limit,
  });
}
/**
 * 创建
 */
export async function aiPowerCreate(data: AiModelPower) {
  return fetchPostCreate(baseApi, data);
}
/**
 * 查询单个详情
 * @param id id
 */
export async function aiPowerDetail(id: ModelId) {
  return fetchGetDetail<AiModelPowerDetail>(baseApi, id);
}

/**
 * 更新单个
 * @param id id
 */
export async function aiPowerUpdate(id: ModelId, data: AiModelPower) {
  return fetchPostUpdate(baseApi, id, data);
}

/**
 * 删除单个
 * @param id id
 */
export async function aiPowerDelete(id: ModelId) {
  return fetchPostDelete<AiModelPower>(baseApi, id);
}

export async function aiPowerApiKey(
  id: ModelId
): Promise<DetailResponse<AiModelPowerKey[]>> {
  return await fetchGet(`/api${baseApi}${id}/key/`);
}
export async function aiPowerApiKeyCreate(
  id: ModelId
): Promise<DetailResponse<AiModelPowerKey>> {
  return await fetchPost(`/api${baseApi}${id}/key/`);
}
export async function aiPowerApiKeyDelete(
  id: ModelId,
  apiKey: string
): Promise<DetailResponse<AiModelPowerKey>> {
  return await fetchPost(`/api${baseApi}${id}/key/${apiKey}/delete/`);
}

export async function aiPowerArgs(id: ModelId) {
  return await fetchGet<DetailResponse<Array<ArgData>>>(`/api${baseApi}${id}/args/`);
}

export async function aiPowerArgsUpdate(id: ModelId, args: string) {
  return fetchPost<DetailResponse<unknown>>(`/api${baseApi}${id}/args/`, {
    args: args,
  });
}
