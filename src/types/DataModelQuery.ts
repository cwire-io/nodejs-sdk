export type DataModelQuery$WhereOperators = {
  $like: string;
  $iLike: string;
  $regex: string;
  $notLike: string;
  $notRegex: string;
  $between: number[];
  $equal: number | string;
  $notEqual: number | string;
  $notBetween: number[];
  $lower: number;
  $lowerOrEqual: number;
  $higher: number;
  $higherOrEqual: number;
  $in: (string | number)[];
  $or: (number | string)[];
  $notIn: (string | number)[];
  $is: string | null | number;
};

export type RefDataModelQuery = {
  model: string;
} & Partial<{
  $where: Partial<DataModelQuery$WhereOperators>;
  $count: Partial<{}>;
}>;

export type DataModelQuery$Where = Partial<{
  $or: DataModelQuery$Where[];
  $and: DataModelQuery$Where[];
}> &
  Partial<{
    [fieldName: string]: string | number | DataModelQuery$WhereOperators;
  }>;

export type DataModelQuery = {
  limit?: number;
  offset?: number;
  group?: string[];
  include?: [string];
  attributes?: string[];
  order?: string[] | [string, 'DESC'][];
  where?: DataModelQuery$Where;
};
