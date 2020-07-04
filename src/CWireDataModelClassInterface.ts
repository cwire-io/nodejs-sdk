export interface CWireDataModelClassInterface<ParameterType> {
  parse: (data: any[] | any) => this;
  changeByObject: (obj: ParameterType) => void;
}
