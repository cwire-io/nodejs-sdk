export type DataModelActionType = "button" | "alert" | "toggle";
export interface DataModelActionOptions {
  onTrigger: () => void;
  type: DataModelActionType;
}
export class DataModelAction {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return name;
  }
}
