"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/app/actions/types";
import Image from "next/image";
import { DataTableRowActions } from "./row-actions/row-actions";
import { BanIcon } from "lucide-react";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "price",
    header: "Price (USD)",
    cell: ({ getValue }) => `$${getValue()}`,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ getValue }) => {
      const imageUrl = getValue() as string | null;
      return imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-10 h-10"
        >
          <Image
            src={imageUrl}
            alt="Event"
            width={40}
            height={40}
            className="object-cover rounded hover:opacity-80 cursor-pointer"
          />
        </a>
      ) : (
        <div className="flex items-center justify-center w-full"> 
          <BanIcon className="h-4 w-4 text-red-500" />
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
