import { CWire } from './CWire';
import { WrongFieldReferenceError, WrongFieldTypeError } from './errors';
import {
  DataModelFieldOptionsType,
  DataModelFieldType,
  DataModelReferenceFieldType,
} from './types/DataModelFields';

export class DataModelField {
  private readonly name: string;
  private readonly isPrimary: boolean;
  private readonly type: DataModelFieldType;
  private reference: DataModelReferenceFieldType | null = null;

  constructor(name: string, options: DataModelFieldOptionsType) {
    this.name = name;

    if (!DataModelField.isValidFieldType(options.type)) {
      throw new WrongFieldTypeError();
    }

    if (
      options.reference &&
      DataModelField.isValidFieldReference(options.reference)
    ) {
      this.reference = {
        field: options.reference.field,
        model: options.reference.model,
      };
    }

    this.isPrimary = !!options.isPrimary;
    // @ts-ignore
    this.type = options.type;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): string {
    return this.type;
  }

  public setReference(reference: DataModelReferenceFieldType) {
    if (!DataModelField.isValidFieldReference(reference)) {
      throw new WrongFieldReferenceError();
    }

    this.reference = reference;
  }

  public toJSON() {
    return {
      name: this.name,
      type: this.type,
      reference: this.reference
        ? {
            model: this.reference.model,
            field: this.reference.field,
          }
        : null,
      isPrimary: this.isPrimary,
    };
  }

  public isPrimaryField() {
    return this.isPrimary;
  }

  public static isValidFieldReference(reference: any) {
    if (typeof reference !== 'object' || !reference) return false;

    const { model, field } = reference;

    if (typeof model !== 'string' && typeof field !== 'string') {
      return false;
    }

    return true;
  }

  public static isValidFieldType(type: any): boolean {
    if (typeof type !== 'string') return false;

    // @ts-ignore
    return !!CWire.FIELD_TYPES[type.toUpperCase()];
  }
}
