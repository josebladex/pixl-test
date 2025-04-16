import { Label } from "@/components/ui/label";
import EventDataTable from "./_components/data-table/page";
import CreateEventButton from "./_components/data-table/row-actions/forms/create-event/card";

export default function AdminPage() {
  return (
    <div className="w-full h-screen flex-col gap-2">
      <div className="w-full h-fit flex gap-4 p-4">
        <Label className="text-indigo-500 text-2xl underline font-bold">
          Event Manager
        </Label>
      </div>
      <div className="w-full h-fit flex gap-4 p-4">
        <CreateEventButton />
      </div>
      <div className="w-full h-fit flex gap-4 p-4">
        <EventDataTable />
      </div>
    </div>
  );
}
