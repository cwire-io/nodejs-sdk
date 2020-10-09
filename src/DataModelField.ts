import { CWire } from "./CWire";
import { WrongFieldTypeError } from "./errors";
import {
  DataModelFieldOptionsType,
  DataModelFieldType,
} from "./types/DataModelFields";

export class DataModelField {
  private readonly name: string;
  private type: DataModelFieldType;

  constructor(name: string, options: DataModelFieldOptionsType) {
    this.name = name;

    if (!DataModelField.isValidFieldType(options.type)) {
      throw new WrongFieldTypeError();
    }

    // @ts-ignore
    this.type = options.type;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): string {
    return this.type;
  }

  public toJSON() {
    return {
      name: this.name,
      type: this.type,
    };
  }

  public static isValidFieldType(type: any): boolean {
    if (typeof type !== "string") return false;

    // @ts-ignore
    return !!CWire.FIELD_TYPES[type.toUpperCase()];
  }
}
