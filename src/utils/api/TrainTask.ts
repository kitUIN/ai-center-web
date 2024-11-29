import { DetailResponse, fetchGet, fetchGetDetail, fetchGetList, fetchGetSimple, fetchPost, fetchPostCreate, fetchPostDelete, fetchPostUpdate } from "./BaseFetch";
import { AiModelPlan } from "./models/AiModelPlan";
import { ModelId } from "./models/Base";
import { TrainTask } from "./models/TrainTask";
import { TrainTaskLog } from "./models/TrainTaskLog";

const baseApi = "/train/task/";
/**
 * 查询列表
 */
export async function trainTaskList(page: number = 1, limit: number = 20) {
  return fetchGetList<TrainTask>(baseApi, {
    page: page,
    limit: limit,
  });
}
/**
 * 查询列表
 */
export async function trainTaskSimple() {
  return fetchGetSimple<AiModelPlan[]>('/train/plan/');
}
/**
 * 创建
 */
export async function trainTaskStart(planId:ModelId) {
  return await fetchPost<DetailResponse<unknown>>(`/api/train/plan/${planId}/start/`, {} as Record<string, unknown>);
}
/**
 * 查询单个详情
 * @param id id
 */
export async function trainTaskDetail(id: ModelId) {
  return fetchGetDetail<TrainTask>(baseApi, id);
}

/**
 * 更新单个
 * @param id id
 */
export async function trainTaskUpdate(id: ModelId, data: TrainTask) {
  return fetchPostUpdate(baseApi, id, data);
}

/**
 * 删除单个
 * @param id id
 */
export async function trainTaskDelete(id: ModelId) {
  return fetchPostDelete<TrainTask>(baseApi, id);
}

export async function trainTaskLog(id: ModelId) {
  return await fetchGet<DetailResponse<TrainTaskLog>>(`/api${baseApi}${id}/log/`);
}