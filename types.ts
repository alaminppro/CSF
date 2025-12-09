export interface Student {
  id: number;
  name: string;
  union: string;
  department: string;
  session: string;
  mobile: string;
  email: string;
  highSchool: string;
  primarySchool: string;
  facebook: string;
  gender: 'male' | 'female';
}

export type UnionName = string;