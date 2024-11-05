type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
function objectToQueryParams(data: Record<string, any>): string {
  return new URLSearchParams(data).toString();
}

async function fetchData<T>(
  method: HttpMethod,
  api: string,
  data?: Record<string, any>
): Promise<T> {
  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method === "GET" && data) {
    const queryParams = objectToQueryParams(data);
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
  data?: Record<string, any>
): Promise<T> {
  return await fetchData("GET", api, data);
}

export async function fetchPost<T>(
  api: string,
  data?: Record<string, any>
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

const baseUrl = import.meta.env.VITE_BASE_API;

export async function fetchGetList<T>(
  api: string,
  data?: Record<string, any>
): Promise<ListResponse<T>> {
  return await fetchGet(baseUrl + api, data);
}
export async function fetchGetDetail<T>(
  api: string,
  data?: Record<string, any>
): Promise<DetailResponse<T>> {
  return await fetchGet(baseUrl + api, data);
}
