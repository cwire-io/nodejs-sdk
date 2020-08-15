export interface IAPIModel<APIParameter> {
    changeByObject: (obj: APIParameter) => void;
}
