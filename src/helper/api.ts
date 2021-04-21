import { AxiosResponse } from 'axios';

export function parseResponse<DataType = any>(res: AxiosResponse): DataType {
  return res.data.data;
}
