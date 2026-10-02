"use client";

import { useMemo } from "react";
import { schoolStore } from "@/src/store/schoolStore";
import type {
  Grade,
  ResourceMap,
  ResourceName,
  SchoolClass,
  Subject,
} from "@/src/types/school";

export function useSchoolData<R extends ResourceName>(
  resource: R,
): ResourceMap[R][] {
  return schoolStore((state) => state[resource]) as ResourceMap[R][];
}

export type Lookups = {
  gradeById: Map<string, Grade>;
  classById: Map<string, SchoolClass>;
  subjectById: Map<string, Subject>;
  classByNum: Map<string, SchoolClass>;
  studentCountByClass: Map<string, number>;
  subjectCountByGrade: Map<string, number>;
  classCountByGrade: Map<string, number>;
  studentCountBySubject: Map<string, number>;
  teacherCountByClassNum: Map<string, number>;
};

function byId<T extends { _id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item._id, item]));
}

function countBy<T>(items: T[], getKeys: (item: T) => string[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const key of new Set(getKeys(item))) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

// Select each array on its own: a selector that builds a new object would re-render forever in zustand v5.
export function useLookups(): Lookups {
  const grades = schoolStore((state) => state.grades);
  const subjects = schoolStore((state) => state.subjects);
  const classes = schoolStore((state) => state.classes);
  const teachers = schoolStore((state) => state.teachers);
  const students = schoolStore((state) => state.students);

  const gradeById = useMemo(() => byId(grades), [grades]);
  const subjectById = useMemo(() => byId(subjects), [subjects]);
  const classById = useMemo(() => byId(classes), [classes]);
  const classByNum = useMemo(
    () => new Map(classes.map((item) => [item.classNum, item])),
    [classes],
  );
  const subjectCountByGrade = useMemo(
    () => countBy(subjects, (subject) => [subject.grade]),
    [subjects],
  );
  const classCountByGrade = useMemo(
    () => countBy(classes, (item) => [item.grade]),
    [classes],
  );
  const teacherCountByClassNum = useMemo(
    () => countBy(teachers, (teacher) => [teacher.classNum]),
    [teachers],
  );
  const studentCountByClass = useMemo(
    () => countBy(students, (student) => [student.class]),
    [students],
  );
  const studentCountBySubject = useMemo(
    () => countBy(students, (student) => student.subjectsIds ?? []),
    [students],
  );

  return useMemo(
    () => ({
      gradeById,
      classById,
      subjectById,
      classByNum,
      studentCountByClass,
      subjectCountByGrade,
      classCountByGrade,
      studentCountBySubject,
      teacherCountByClassNum,
    }),
    [
      gradeById,
      classById,
      subjectById,
      classByNum,
      studentCountByClass,
      subjectCountByGrade,
      classCountByGrade,
      studentCountBySubject,
      teacherCountByClassNum,
    ],
  );
}
