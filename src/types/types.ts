export enum UserType {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  neptunCode: string;
  emailAddress: string;
  type: UserType;
};

export type Course = {
  _id: string;
  code: string;
  name: string;
  studentCount: number;
  averageGrade?: number;
};

export type Student = {
  firstName: string;
  lastName: string;
  neptunCode: string;
  lastLoginAt: string;
  averageGrade?: number;
  _id: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  deadline: Date;
  createdAt: Date;
  courseName: string;
};
