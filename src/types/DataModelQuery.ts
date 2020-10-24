export type DataModelQuery = {
  limit?: number;
  offset?: number;
  group?: string[];
  order?: string[] | [string, "DESC"][];
  attributes?: string[];
  where?: {
    [fieldName: string]:
      | string
      | number
      | Partial<{
          $like: string;
          $iLike: string;
          $regex: string;
          $notLike: string;
          $notRegex: string;
          $between: number[];
          $equal: number | string;
          $or: (string | number)[];
          $notEqual: number | string;
          $notBetween: number[];
          $lower: number;
          $lowerOrEqual: number;
          $higher: number;
          $higherOrEqual: number;
          $in: string | number;
          $notIn: (string | number)[];
          $is: string | null | number;
        }>;
  };
};
