import type { Lookups } from "@/src/hooks/useSchool";
import type {
  Grade,
  SchoolClass,
  Student,
  StudentInput,
  Subject,
} from "@/src/types/school";

export type StudentRow = Student & {
  fullName: string;
  schoolClass: SchoolClass | null;
  grade: Grade | null;
  subjects: Subject[];
  unknownSubjectCount: number;
};

export const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export function fullNameOf(student: Pick<Student, "firstName" | "lastName">) {
  return `${student.firstName} ${student.lastName}`.trim();
}

export function studentHref(id: string) {
  return `/students/${encodeURIComponent(id)}`;
}

export function classHref(id: string) {
  return `/classes/${encodeURIComponent(id)}`;
}

// Resolves the student's class, grade (through the class) and subjects.
export function toStudentRow(
  student: Student,
  { classById, gradeById, subjectById }: Lookups,
): StudentRow {
  const schoolClass = classById.get(student.class) ?? null;
  const grade = schoolClass ? (gradeById.get(schoolClass.grade) ?? null) : null;
  const subjects: Subject[] = [];
  let unknownSubjectCount = 0;

  for (const id of new Set(student.subjectsIds ?? [])) {
    const subject = subjectById.get(id);
    if (subject) subjects.push(subject);
    else unknownSubjectCount += 1;
  }
  subjects.sort((a, b) => collator.compare(a.name, b.name));

  return {
    ...student,
    fullName: fullNameOf(student),
    schoolClass,
    grade,
    subjects,
    unknownSubjectCount,
  };
}

function sameIds(a: string[], b: string[]) {
  const left = new Set(a);
  const right = new Set(b);
  if (left.size !== right.size) return false;
  for (const id of left) if (!right.has(id)) return false;
  return true;
}

// Only the fields that differ from the saved student.
export function diffStudent(
  original: Student,
  next: StudentInput,
): Partial<StudentInput> {
  const changes: Partial<StudentInput> = {};
  if (next.firstName !== original.firstName) changes.firstName = next.firstName;
  if (next.lastName !== original.lastName) changes.lastName = next.lastName;
  if (next.age !== original.age) changes.age = next.age;
  if (next.class !== original.class) changes.class = next.class;
  if (!sameIds(next.subjectsIds, original.subjectsIds ?? [])) {
    changes.subjectsIds = next.subjectsIds;
  }
  return changes;
}
