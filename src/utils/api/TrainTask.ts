import {
  DetailResponse,
  fetchGet,
  fetchGetDetail,
  fetchGetList,
  fetchGetSimple,
  fetchPost,
  fetchPostDelete,
  fetchPostUpdate,
} from "./BaseFetch";
import { AiModelPlan } from "./models/AiModelPlan";
import { ModelId } from "./models/Base";
import { TrainTask } from "./models/TrainTask";
import { TrainTaskLog, TrainTaskLogDetail } from "./models/TrainTaskLog";

const baseApi = "/train/task/";
/**
 * 查询列表
 */
export async function trainTaskList(page: number = 1, limit: number = 20,plan?:string | null) {
  const data:{
    [key: string]: string |number; 
} = {
    page: page,
    limit: limit,
  }
  if (plan!=null && plan !=undefined){
    data["plan"] = plan;
  }
  return fetchGetList<TrainTask>(baseApi, data);
}
/**
 * 查询列表
 */
export async function trainTaskSimple() {
  return fetchGetSimple<AiModelPlan[]>("/train/plan/");
}
/**
 * 创建
 */
export async function trainTaskStart(planId: ModelId) {
  return await fetchPost<DetailResponse<unknown>>(
    `/api/train/plan/${planId}/start/`,
    {} as Record<string, unknown>
  );
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
  return await fetchGet<DetailResponse<TrainTaskLog>>(
    `/api${baseApi}${id}/log/`
  );
}
export async function trainTaskLogDetail(
  id: ModelId,
  log_type: string,
  pos: number
) {
  return await fetchGet<DetailResponse<TrainTaskLogDetail>>(
    `/api${baseApi}${id}/log/detail/`,
    {
      log_type: log_type,
      pos: pos,
    }
  );
}
