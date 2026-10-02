import { create } from "zustand";
import {
  mockClasses,
  mockGrades,
  mockStudents,
  mockSubjects,
  mockTeachers,
} from "@/src/mocks/school";
import type {
  InputMap,
  ResourceMap,
  ResourceName,
} from "@/src/types/school";

// Local, in-memory school data seeded from src/mocks.

type Collections = { [R in ResourceName]: ResourceMap[R][] };

type SchoolState = Collections & {
  add: <R extends ResourceName>(resource: R, input: InputMap[R]) => ResourceMap[R];
  update: <R extends ResourceName>(
    resource: R,
    id: string,
    input: Partial<InputMap[R]>,
  ) => ResourceMap[R] | undefined;
  remove: (resource: ResourceName, id: string) => void;
};

function randomHex(bytes: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

// Generated fields the form doesn't provide (e.g. STD-/TECH- ids).
function generatedFields(resource: ResourceName) {
  if (resource === "students") return { studentId: `STD-${randomHex(4).toUpperCase()}` };
  if (resource === "teachers") return { teacherId: `TECH-${randomHex(4).toUpperCase()}` };
  return {};
}

export const schoolStore = create<SchoolState>()((set, get) => ({
  grades: mockGrades,
  subjects: mockSubjects,
  classes: mockClasses,
  teachers: mockTeachers,
  students: mockStudents,

  add: (resource, input) => {
    const now = new Date().toISOString();
    const item = {
      ...input,
      ...generatedFields(resource),
      _id: randomHex(12),
      createdAt: now,
      updatedAt: now,
    } as unknown as ResourceMap[typeof resource];
    set({ [resource]: [...get()[resource], item] } as Partial<Collections>);
    return item;
  },

  update: (resource, id, input) => {
    let updated: ResourceMap[typeof resource] | undefined;
    const items = (get()[resource] as ResourceMap[typeof resource][]).map((item) => {
      if (item._id !== id) return item;
      updated = { ...item, ...input, updatedAt: new Date().toISOString() };
      return updated;
    });
    set({ [resource]: items } as Partial<Collections>);
    return updated;
  },

  remove: (resource, id) => {
    const items = (get()[resource] as { _id: string }[]).filter((item) => item._id !== id);
    set({ [resource]: items } as Partial<Collections>);
  },
}));
