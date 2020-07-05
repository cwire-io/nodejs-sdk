export interface StaticAPIInterface<BaseClass> {
  parse: (data: any | any[]) => BaseClass | BaseClass[];
}
export interface APIInterface<APIParameter> {
  changeByObject: (obj: APIParameter) => void;
}
