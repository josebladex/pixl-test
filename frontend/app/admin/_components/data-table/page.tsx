import { columns } from "./columns";
import { DataTable } from "./data-table";
import { readAllEvents } from "@/app/actions/events";

export default async function EventDataTable() {
  // Obtiene los datos directamente desde el servidor
  const data = (await readAllEvents()).map(event => ({
    ...event,
    image: event.image ?? undefined,
  }));

  return (
    <div className="container mx-auto py-2">
      {data.length === 0 ? (
        <div className="text-center text-gray-500">
          Not available events.
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
