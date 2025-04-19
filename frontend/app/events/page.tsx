import { readAllEvents } from '@/app/actions/events';
import EventCard from './_components/event-card';

export default async function EventsPage() {
  const events = await readAllEvents();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-6 text-indigo-500 underline font-bold">Upcoming Events</h1>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              price={event.price}
              image={event.image}
              createdByEmail={event.createdBy.email}
              transactions={event.transaction}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No events available at the moment.</p>
      )}
    </div>
  );
}
