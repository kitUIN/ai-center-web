import {
  DetailResponse,
  fetchGet,
  fetchGetDetail,
  fetchGetList,
  fetchGetSimple,
  fetchPost,
  fetchPostCreate,
  fetchPostDelete,
  fetchPostUpdate,
} from "./BaseFetch";
import { ModelId } from "./models/Base";
import { AiModel } from "./models/AiModel";
import { AiModelFile } from "./models/AiModelFile";
import { AiModelPlan } from "./models/AiModelPlan";
import { PluginModel } from "./models/PluginModel";
import { TrainPlanTemplate } from "./models/PlanTemplate";

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
  return fetchGetList<AiModelFile>(`${baseApi}${id}/file`, {
    page: page,
    limit: limit,
  });
}
/**
 * 查询文件列表
 */
export async function aiFileSimpleList(id: ModelId) {
  return fetchGetSimple<AiModelFile[]>(`${baseApi}${id}/file/`);
}
/**
 * 删除单个文件
 * @param id id
 */
export async function aiFileDelete(id: ModelId, file_id: ModelId) {
  return fetchPost<DetailResponse<AiModelFile>>(
    `/api${baseApi}${id}/file/${file_id}/delete/`
  );
}
/**
 * 查询计划列表
 */
export async function aiPlanList(
  id: ModelId,
  page: number = 1,
  limit: number = 20
) {
  return fetchGetList<AiModelPlan>(`${baseApi}${id}/plan`, {
    page: page,
    limit: limit,
  });
}
/**
 * 删除单个计划
 * @param id id
 */
export async function aiPlanDelete(id: ModelId, file_id: ModelId) {
  return fetchPost<DetailResponse<AiModelPlan>>(
    `/api${baseApi}${id}/plan/${file_id}/delete/`
  );
}
/**
 * 创建计划
 */
export async function aiPlanCreate(id: ModelId, data: AiModelPlan) {
  return fetchPostCreate(`${baseApi}${id}/plan/`, data);
}

export async function aiPluginList() {
  return await fetchGet<DetailResponse<PluginModel[]>>(`/api${baseApi}key`);
}

export async function aiPlanTemplateList(id: ModelId) {
  return await fetchGet<DetailResponse<TrainPlanTemplate>>(
    `/api${baseApi}${id}/cmd/`
  );
}
