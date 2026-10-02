"use client";

import { useMemo } from "react";
import {
  BookOpen,
  GraduationCap,
  Presentation,
  School,
  Users,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { PageHeader } from "@/src/components/ui/page-header";
import { StatCard } from "@/src/components/ui/stat-card";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { cn } from "@/src/lib/utils";
import {
  ClassOccupancyPanel,
  type OccupancyRow,
  type OccupancyTotals,
} from "./ClassOccupancyPanel";
import { QuickActions } from "./QuickActions";
import { SetupChecklist, type SetupStep } from "./SetupChecklist";
import {
  StudentsPerGradePanel,
  type GradeBucket,
} from "./StudentsPerGradePanel";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export default function DashboardView() {
  const t = useTranslations("dashboard");
  const format = useFormatter();

  const grades = useSchoolData("grades");
  const subjects = useSchoolData("subjects");
  const classes = useSchoolData("classes");
  const teachers = useSchoolData("teachers");
  const students = useSchoolData("students");
  const { gradeById, classById, studentCountByClass } = useLookups();

  // Fullest classes first; ties fall back to the class number.
  const occupancyRows = useMemo<OccupancyRow[]>(
    () =>
      classes
        .map((item) => {
          const count = studentCountByClass.get(item._id) ?? 0;
          const ratio =
            item.capacity > 0
              ? count / item.capacity
              : count > 0
                ? Number.POSITIVE_INFINITY
                : 0;

          return {
            id: item._id,
            classNum: item.classNum,
            gradeName: gradeById.get(item.grade)?.name ?? null,
            count,
            capacity: item.capacity,
            ratio,
          };
        })
        .sort(
          (a, b) =>
            b.ratio - a.ratio ||
            b.count - a.count ||
            collator.compare(a.classNum, b.classNum),
        ),
    [classes, gradeById, studentCountByClass],
  );

  const { totals, fullClasses, freeSeats } = useMemo(() => {
    const summary: OccupancyTotals = { enrolled: 0, seats: 0 };
    let full = 0;
    let free = 0;

    for (const row of occupancyRows) {
      summary.enrolled += row.count;
      summary.seats += row.capacity;
      free += Math.max(0, row.capacity - row.count);
      if (row.capacity > 0 && row.count >= row.capacity) full += 1;
    }

    return { totals: summary, fullClasses: full, freeSeats: free };
  }, [occupancyRows]);

  // Student → class → grade; anything that can't be resolved goes to "Unknown".
  const gradeBuckets = useMemo<GradeBucket[]>(() => {
    const counts = new Map<string, number>();
    let unknown = 0;

    for (const student of students) {
      const gradeId = classById.get(student.class)?.grade;
      if (gradeId && gradeById.has(gradeId)) {
        counts.set(gradeId, (counts.get(gradeId) ?? 0) + 1);
      } else {
        unknown += 1;
      }
    }

    const buckets: GradeBucket[] = [...grades]
      .sort((a, b) => collator.compare(a.name, b.name))
      .map((grade) => ({
        id: grade._id,
        name: grade.name,
        count: counts.get(grade._id) ?? 0,
      }));

    if (unknown > 0) buckets.push({ id: null, name: null, count: unknown });

    return buckets;
  }, [students, grades, classById, gradeById]);

  const setupSteps: SetupStep[] = [
    { key: "grade", done: grades.length > 0, href: "/grades?create=1" },
    { key: "subject", done: subjects.length > 0, href: "/subjects?create=1" },
    { key: "class", done: classes.length > 0, href: "/classes?create=1" },
    { key: "teacher", done: teachers.length > 0, href: "/teachers?create=1" },
    { key: "student", done: students.length > 0, href: "/students?create=1" },
  ];
  const showSetup =
    grades.length === 0 ||
    subjects.length === 0 ||
    classes.length === 0 ||
    students.length === 0;

  const stats = [
    {
      key: "grades",
      href: "/grades",
      icon: <GraduationCap aria-hidden />,
      value: grades.length,
      hint: t("stats.gradesHint"),
    },
    {
      key: "subjects",
      href: "/subjects",
      icon: <BookOpen aria-hidden />,
      value: subjects.length,
      hint: t("stats.subjectsHint"),
    },
    {
      key: "classes",
      href: "/classes",
      icon: <School aria-hidden />,
      value: classes.length,
      hint: t("stats.classesHint", { full: fullClasses }),
    },
    {
      key: "teachers",
      href: "/teachers",
      icon: <Presentation aria-hidden />,
      value: teachers.length,
      hint: t("stats.teachersHint"),
    },
    {
      key: "students",
      href: "/students",
      icon: <Users aria-hidden />,
      value: students.length,
      hint: t("stats.studentsHint", { seats: freeSeats }),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        className="mb-0"
        title={t("title")}
        description={t("description")}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.key}
            className={cn(
              "rounded-lg shadow-sm",
              index === stats.length - 1 && "col-span-2 md:col-span-1",
            )}
            label={t(`stats.${stat.key}`)}
            value={format.number(stat.value)}
            icon={stat.icon}
            href={stat.href}
            hint={stat.hint}
          />
        ))}
      </div>

      {showSetup && <SetupChecklist steps={setupSteps} />}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <ClassOccupancyPanel rows={occupancyRows} totals={totals} />
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <QuickActions />
          <StudentsPerGradePanel
            buckets={gradeBuckets}
            totalStudents={students.length}
            hasGrades={grades.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
