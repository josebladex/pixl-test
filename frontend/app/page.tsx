import { getEvents } from '@/actions/events';

export default async function Home() {
  const events = await getEvents();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Eventos Disponibles</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.title} - ${event.price}</li>
        ))}
      </ul>
    </div>
  );
}