import * as Yup from "yup";

function personName(label: "First name" | "Last name") {
  return Yup.string()
    .typeError(`${label} is required and must be text`)
    .trim()
    .required(`${label} is required and must be text`)
    .min(2, `${label} must be at least 2 characters long`)
    .max(100, `${label} must not exceed 100 characters`);
}

function age(min: number, max: number) {
  return Yup.number()
    .typeError("Age is required and must be a number")
    .required("Age is required and must be a number")
    .integer("Age must be a whole number")
    .min(min, `Age must be at least ${min}`)
    .max(max, `Age must not exceed ${max}`);
}

export const gradeSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
});

export const subjectSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  grade: Yup.string().trim().required("Grade ID is required"),
});

export function makeClassSchema(minCapacity = 1) {
  const capacityMessage = "Capacity must be a positive integer";
  const minMessage =
    minCapacity > 1
      ? `This class already has ${minCapacity} students`
      : capacityMessage;

  return Yup.object({
    classNum: Yup.string().trim().required("Class number is required"),
    floorNum: Yup.number()
      .typeError("Floor number must be a positive integer")
      .required("Floor number must be a positive integer")
      .integer("Floor number must be a positive integer")
      .min(1, "Floor number must be a positive integer"),
    buildingNum: Yup.string().trim().required("Building number is required"),
    capacity: Yup.number()
      .typeError(capacityMessage)
      .required(capacityMessage)
      .integer(capacityMessage)
      .min(Math.max(1, minCapacity), minMessage)
      .max(15, "Capacity cannot exceed 15"),
    grade: Yup.string().trim().required("Grade ID is required"),
  });
}

export const classSchema = makeClassSchema();

export const teacherSchema = Yup.object({
  firstName: personName("First name"),
  lastName: personName("Last name"),
  age: age(21, 70),
  classNum: Yup.string()
    .typeError("Class number is required and must be text")
    .trim()
    .required("Class number cannot be empty")
    .max(20, "Class number must not exceed 20 characters"),
});

export const studentSchema = Yup.object({
  firstName: personName("First name"),
  lastName: personName("Last name"),
  age: age(4, 25),
  class: Yup.string().trim().required("Select a class"),
  subjectsIds: Yup.array()
    .of(Yup.string().trim().required())
    .required("At least one subject is required")
    .min(1, "At least one subject is required"),
});

// Case-insensitive uniqueness check for Yup `.test`, ignoring the record being edited.
export function isTaken(
  taken: string[],
  value: string | undefined,
  currentValue?: string,
): boolean {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return false;
  if (currentValue?.trim().toLowerCase() === normalized) return false;
  return taken.some((item) => item.trim().toLowerCase() === normalized);
}
