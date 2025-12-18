export interface Student {
  id: number;
  name: string;
  union: string;
  department: string;
  session: string;
  mobile: string;
  email: string;
  highSchool: string;
  college: string; // New field
  villageWard: string; // New field
  facebook: string;
  gender: 'male' | 'female';
}

export type UnionName = string;