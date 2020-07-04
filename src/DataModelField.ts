export type DataModelFieldType =
  | "text"
  | "email"
  | "number"
  | "custom"
  | "boolean"
  | "password"
  | "description";
export interface DataModelFieldOptions {
  type: DataModelField;
}
export class DataModelField {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return name;
  }
}
