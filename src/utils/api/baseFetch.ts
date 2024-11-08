import { ModelId } from "./models/Base";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
function objectToQueryParams(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}

async function fetchData<T>(
  method: HttpMethod,
  api: string,
  data?: Record<string, unknown>
): Promise<T> {
  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method === "GET" && data) {
    const queryParams = objectToQueryParams(data as Record<string, string>);
    api = `${api}?${queryParams}`;
  } else if ((method === "POST" || method === "PUT") && data) {
    options.body = JSON.stringify(data); // 将数据转换为 JSON 格式
  }

  try {
    const response = await fetch(api, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData: T = await response.json();
    return responseData;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}
export async function fetchGet<T>(
  api: string,
  data?: Record<string, unknown>
): Promise<T> {
  return await fetchData("GET", api, data);
}

export async function fetchPost<T>(
  api: string,
  data?: Record<string, unknown>
): Promise<T> {
  return await fetchData("POST", api, data);
}

export interface ListResponseData<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}
/**
 * 基础返回
 */
interface BaseResponse {
  /**
   * 状态码
   * 200为成功
   * 400为失败
   */
  code: number;
  /**
   * 说明
   */
  msg: string;
}
/**
 * 列表返回
 */
export interface ListResponse<T> extends BaseResponse {
  data?: ListResponseData<T>;
}
/**
 * 详情返回
 */
export interface DetailResponse<T> extends BaseResponse {
  data?: T;
}

export async function fetchGetList<T>(
  api: string,
  data?: T | null
): Promise<ListResponse<T>> {
  return await fetchGet("/api" + api, data as Record<string, unknown>);
}
export async function fetchGetDetail<T>(
  baseApi: string,
  id: ModelId
): Promise<DetailResponse<T>> {
  return await fetchGet(`/api${baseApi}${id}/`);
}

export async function fetchPostCreate<T>(
  api: string,
  data?: T
): Promise<DetailResponse<T>> {
  return await fetchPost("/api" + api, data as Record<string, unknown>);
}
/**
 * 更新单个
 * @param id id
 */
export async function fetchPostUpdate<T>(
  baseApi: string,
  id: ModelId,
  data: T
) {
  return fetchPost(`/api${baseApi}${id}/update/`, data as Record<string, unknown>);
}

/**
 * 删除单个
 * @param id id
 */
export async function fetchPostDelete<T>(baseApi: string, id: ModelId) {
  return fetchPost<DetailResponse<T>>(`/api${baseApi}${id}/delete/`);
}
