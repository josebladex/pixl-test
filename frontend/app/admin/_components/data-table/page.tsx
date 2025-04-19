import { columns } from './columns';
import { DataTable } from './data-table';
import { readEventsByUserId } from '@/app/actions/events';

interface EventDataTableProps {
  id: number;
}
export default async function EventDataTable({ id }: EventDataTableProps) {
  const data = await readEventsByUserId(id);

  return (
    <div className="container mx-auto py-2">
      {data.length === 0 ? (
        <div className="text-center text-gray-500">Events not yet Created.</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
