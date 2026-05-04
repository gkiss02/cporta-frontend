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
