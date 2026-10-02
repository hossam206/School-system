export type ObjectId = string;

export type BaseDoc = {
  _id: ObjectId;
  createdAt: string;
  updatedAt: string;
};

export type Grade = BaseDoc & { name: string };

export type Subject = BaseDoc & { name: string; grade: ObjectId };

export type SchoolClass = BaseDoc & {
  classNum: string;
  floorNum: number;
  buildingNum: string;
  capacity: number;
  grade: ObjectId;
};

export type Teacher = BaseDoc & {
  teacherId: string;
  firstName: string;
  lastName: string;
  age: number;
  classNum: string;
};

export type Student = BaseDoc & {
  studentId: string;
  firstName: string;
  lastName: string;
  age: number;
  class: ObjectId;
  subjectsIds: ObjectId[];
};

export type GradeInput = { name: string };

export type SubjectInput = { name: string; grade: ObjectId };

export type SchoolClassInput = {
  classNum: string;
  floorNum: number;
  buildingNum: string;
  capacity: number;
  grade: ObjectId;
};

export type TeacherInput = {
  firstName: string;
  lastName: string;
  age: number;
  classNum: string;
};

export type StudentInput = {
  firstName: string;
  lastName: string;
  age: number;
  class: ObjectId;
  subjectsIds: ObjectId[];
};

export type ResourceMap = {
  grades: Grade;
  subjects: Subject;
  classes: SchoolClass;
  teachers: Teacher;
  students: Student;
};

export type InputMap = {
  grades: GradeInput;
  subjects: SubjectInput;
  classes: SchoolClassInput;
  teachers: TeacherInput;
  students: StudentInput;
};

export type ResourceName = keyof ResourceMap;
