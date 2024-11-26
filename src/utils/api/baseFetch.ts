import { ModelId } from "./models/Base";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
function objectToQueryParams(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}

async function fetchData<T>(
  method: HttpMethod,
  api: string,
  data?: Record<string, unknown>,
  files?: File[]
): Promise<T> {
  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method === "GET") {
    if (data) {
      const queryParams = objectToQueryParams(data as Record<string, string>);
      api = `${api}?${queryParams}`;
    } else if (files) {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }
      options.body = formData;
    }
  } else if ((method === "POST" || method === "PUT") && data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(api, options);

    if (!response.ok) {
      throw new Error(await response.text());
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

export async function fetchUpload<T>(api: string, files?: File[]): Promise<T> {
  return await fetchData("POST", api, {}, files);
}

export interface ListResponseData<T> {
  page: number;
  limit: number;
  total: number;
  pages: number;
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

export interface PagedRequest {
  page: number;
  limit: number;
}

export async function fetchGetList<T>(
  api: string,
  data?: T | PagedRequest | (T & PagedRequest) | null
): Promise<ListResponse<T>> {
  return await fetchGet("/api" + api, data as Record<string, unknown>);
}

export async function fetchGetSimple<T>(
  api: string,
): Promise<DetailResponse<T>> {
  return await fetchGet(`/api${api}simple`);
}

export async function fetchGetDetail<T>(
  baseApi: string,
  id: ModelId
): Promise<DetailResponse<T>> {
  return await fetchGet(`/api${baseApi}${id}/`);
}
export async function fetchUploadDetail<T>(
  url: string,
  files: File[]
): Promise<DetailResponse<T>> {
  return await fetchUpload(`/api${url}/`, files);
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
  return fetchPost<DetailResponse<T>>(
    `/api${baseApi}${id}/update/`,
    data as Record<string, unknown>
  );
}

/**
 * 删除单个
 * @param id id
 */
export async function fetchPostDelete<T>(baseApi: string, id: ModelId) {
  return fetchPost<DetailResponse<T>>(`/api${baseApi}${id}/delete/`);
}
