"use client";

import {
  Table,
  TableColumnHeader,
  TableAction,
} from "@/src/components/ui/Table";

interface Project {
  id: number;
  name: string;
}

const headers: TableColumnHeader<Project>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "type", label: "Name" },
  { key: "name", label: "Name" },
];

const actions: TableAction<Project>[] = [
  {
    label: "Edit",
    value: "edit",
    variant: "primary",
    onclick: (row) => console.log("Edit", row),
  },
  {
    label: "Delete",
    value: "delete",
    variant: "destructive",
    onclick: (row) => console.log("Delete", row),
  },
];

export default function HomeTable({ data }: { data: Project[] }) {
  return (
    <Table
      headers={headers}
      data={data}
      onClick={(row) => console.log("Row clicked", row)}
      haveActions={true}
      actions={actions}
    />
  );
}
