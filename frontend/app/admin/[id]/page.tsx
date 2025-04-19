import { Label } from '@/components/ui/label';
import EventDataTable from '../_components/data-table/page';
import CreateEventButton from '../_components/data-table/row-actions/forms/create-event/card';

export default async function AdminPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  return (
    <div className="w-full h-screen flex-col gap-2">
      <div className="w-full h-fit flex gap-4 p-4">
        <Label className="text-3xl mb-6 text-indigo-500 underline font-bold">Event Manager</Label>
      </div>
      <div className="w-full h-fit flex gap-4 p-4">
        <CreateEventButton />
      </div>
      <div className="w-full h-fit flex gap-4 p-4">
        <EventDataTable id={id} />
      </div>
    </div>
  );
}
