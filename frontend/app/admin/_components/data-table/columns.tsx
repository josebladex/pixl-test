'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { DataTableRowActions } from './row-actions/row-actions';
import { BanIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SerializedEvent } from '@/app/actions/prisma';
import { format } from 'date-fns';

export const columns: ColumnDef<SerializedEvent>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const description = String(row.getValue('title'));
      const truncatedDescription =
        description.length > 10 ? `${description.slice(0, 10)}...` : description;

      return (
        <div className="flex justify-start item center max-w-[100px]">
          <Tooltip>
            <TooltipTrigger>{truncatedDescription}</TooltipTrigger>
            <TooltipContent>
              <div className="p-3 flex justify-center item center max-w-[100px]">
                <p>{description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = String(row.getValue('description'));
      const truncatedDescription =
        description.length > 10 ? `${description.slice(0, 10)}...` : description;

      return (
        <div className="flex justify-center item center max-w-[100px]">
          <Tooltip>
            <TooltipTrigger>{truncatedDescription}</TooltipTrigger>
            <TooltipContent>
              <div className="p-3 flex justify-center item center max-w-[100px]">
                <p>{description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },

  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return (
        <span className="flex items-center justify-start w-full">
          {format(date, 'MMMM dd, yyyy').toString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price (USD)',
    cell: ({ getValue }) => `$${getValue()}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return format(date, 'MMMM dd, yyyy');
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return format(date, 'MMMM dd, yyyy');
    },
  },

  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ getValue }) => {
      const imageUrl = getValue() as string | null;
      return imageUrl ? (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block w-10 h-10">
          <Image
            src={imageUrl}
            alt="Event"
            width={40}
            height={40}
            className="object-cover rounded hover:opacity-80 cursor-pointer"
          />
        </a>
      ) : (
        <div className="flex items-center justify-start w-full">
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
