'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { DeleteIcon, SquareMenu, SquarePen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import IconMenu from '@/components/icon-menu';
import DeleteEvent from './forms/delete-event';
import { EditEventForm } from './forms/edit-event';
import { SerializedEvent } from '@/app/actions/prisma';

interface DataTableRowActionsProps {
  row: Row<SerializedEvent>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={() => setIsEditOpen(!isEditOpen)}>
        <DialogContent className="sm:max-w-[425px] max-h-[900px] py-6">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              You are about to make changes to the selected event.
            </DialogDescription>
          </DialogHeader>
          <EditEventForm row={row} close={(open) => setIsEditOpen(open)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={() => setIsDeleteOpen(!isDeleteOpen)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              This action is irreversible. Are you sure you want to delete the selected event?
            </DialogDescription>
          </DialogHeader>
          <DeleteEvent row={row} setIsOpen={setIsDeleteOpen} />
        </DialogContent>
      </Dialog>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant={'default'} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <SquareMenu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem
            className="focus:bg-accent focus:text-accent-foreground hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
            onClick={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            <div className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100">
              <IconMenu text="Edit Event" icon={<SquarePen className="h-4 w-4" />} />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-destructive/10 focus:text-destructive hover:bg-red-100 hover:text-red-600 cursor-pointer flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
            onClick={(e) => {
              e.preventDefault();
              setIsDeleteOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            <div>
              <IconMenu text="Delete Event" icon={<DeleteIcon className="h-4 w-4" />} />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
