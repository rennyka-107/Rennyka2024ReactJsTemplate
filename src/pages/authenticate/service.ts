import axios_client from "@/services/axios";
import { ILoginRequest } from "./state";
import { IResponse, _API_ } from "@/services/api.constant";

export function apiLogin<T>(payload: ILoginRequest): Promise<IResponse<T>> {
  return axios_client.post(_API_.AUTH.LOGIN, payload);
}
