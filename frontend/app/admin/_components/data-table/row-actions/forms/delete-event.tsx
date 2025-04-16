'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Row } from '@tanstack/react-table';
import { Event } from '../../../../../actions/types';
import { useRouter } from 'next/navigation';
import { SplinePointer } from 'lucide-react';
import { deleteEventAction } from '@/app/actions/events';

interface DeleteEventProps {
  row: Row<Event>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteEvent: React.FC<DeleteEventProps> = ({ row, setIsOpen }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (id: number) => {
    try {
      setLoading(true);

     await deleteEventAction(id)

   toast.success(`Event deleted successfully`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast.error(
        `There was a server error, please try again later: ${errorMessage}`,
      );
    } finally {
      setLoading(false);
      setIsOpen(false);
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <SplinePointer className="w-7 h-7 animate-pulse fill-violet-600" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <DialogClose asChild>
          <Button type="button" variant={'secondary'}>
            Close
          </Button>
        </DialogClose>
        <Button
          className="ml-2"
          variant={'destructive'}
          onClick={() => onSubmit(row.original.id)}
        >
          Delete Event
        </Button>
      </div>
    </>
  );
};

export default DeleteEvent;