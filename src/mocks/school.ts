import type {
  Grade,
  SchoolClass,
  Student,
  Subject,
  Teacher,
} from "@/src/types/school";

// Sample data so the UI works on its own.

const CREATED_AT = "2026-09-01T08:00:00.000Z";

function doc(_id: string) {
  return { _id, createdAt: CREATED_AT, updatedAt: CREATED_AT };
}

export const mockGrades: Grade[] = [
  { ...doc("g1"), name: "Grade 1" },
  { ...doc("g2"), name: "Grade 2" },
  { ...doc("g3"), name: "Grade 3" },
];

export const mockSubjects: Subject[] = [
  { ...doc("s1"), name: "Math", grade: "g1" },
  { ...doc("s2"), name: "English", grade: "g1" },
  { ...doc("s3"), name: "Science", grade: "g1" },
  { ...doc("s4"), name: "Math", grade: "g2" },
  { ...doc("s5"), name: "English", grade: "g2" },
  { ...doc("s6"), name: "Art", grade: "g2" },
  { ...doc("s7"), name: "Math", grade: "g3" },
  { ...doc("s8"), name: "Physics", grade: "g3" },
];

export const mockClasses: SchoolClass[] = [
  { ...doc("c1"), classNum: "1A", floorNum: 1, buildingNum: "A", capacity: 15, grade: "g1" },
  { ...doc("c2"), classNum: "1B", floorNum: 1, buildingNum: "A", capacity: 4, grade: "g1" },
  { ...doc("c3"), classNum: "2A", floorNum: 2, buildingNum: "B", capacity: 10, grade: "g2" },
  { ...doc("c4"), classNum: "3A", floorNum: 3, buildingNum: "B", capacity: 12, grade: "g3" },
];

export const mockTeachers: Teacher[] = [
  { ...doc("t1"), teacherId: "TECH-3F9A21C0", firstName: "Sara", lastName: "Ali", age: 34, classNum: "1A" },
  { ...doc("t2"), teacherId: "TECH-8B12E4D7", firstName: "Omar", lastName: "Hassan", age: 45, classNum: "1B" },
  { ...doc("t3"), teacherId: "TECH-C40D9E11", firstName: "Mona", lastName: "Youssef", age: 29, classNum: "2A" },
  { ...doc("t4"), teacherId: "TECH-51AA07B3", firstName: "Karim", lastName: "Nabil", age: 52, classNum: "3A" },
];

const STUDENT_ROWS: [string, string, number, string, string[]][] = [
  ["Adam", "Mostafa", 6, "c1", ["s1", "s2", "s3"]],
  ["Laila", "Samir", 6, "c1", ["s1", "s2"]],
  ["Youssef", "Adel", 7, "c1", ["s1", "s3"]],
  ["Nour", "Hany", 6, "c1", ["s2", "s3"]],
  ["Hana", "Fathy", 7, "c1", ["s1", "s2", "s3"]],
  ["Ali", "Magdy", 6, "c1", ["s1"]],
  ["Malak", "Tarek", 7, "c1", ["s2"]],
  ["Ziad", "Ashraf", 6, "c1", ["s1", "s2"]],
  ["Farida", "Sherif", 7, "c2", ["s1", "s2", "s3"]],
  ["Hamza", "Reda", 6, "c2", ["s1", "s3"]],
  ["Jana", "Wael", 7, "c2", ["s2"]],
  ["Seif", "Amr", 6, "c2", ["s1", "s2"]],
  ["Mariam", "Khaled", 8, "c3", ["s4", "s5", "s6"]],
  ["Karim", "Ehab", 8, "c3", ["s4", "s5"]],
  ["Salma", "Hossam", 9, "c3", ["s4", "s6"]],
  ["Mostafa", "Ibrahim", 8, "c3", ["s5", "s6"]],
  ["Rana", "Gamal", 9, "c3", ["s4", "s5", "s6"]],
  ["Omar", "Nader", 8, "c3", ["s4"]],
  ["Habiba", "Essam", 10, "c4", ["s7", "s8"]],
  ["Yassin", "Sameh", 10, "c4", ["s7"]],
  ["Lina", "Ayman", 11, "c4", ["s7", "s8"]],
  ["Tamer", "Walid", 10, "c4", ["s8"]],
];

export const mockStudents: Student[] = STUDENT_ROWS.map(
  ([firstName, lastName, age, classId, subjectsIds], index) => ({
    ...doc(`st${index + 1}`),
    studentId: `STD-${(0x1a2b3c00 + index * 7919).toString(16).toUpperCase()}`,
    firstName,
    lastName,
    age,
    class: classId,
    subjectsIds,
  }),
);
