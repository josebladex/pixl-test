'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  price: number;
}

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (id) {
      axios.get<Event>(`/api/events/${id}`).then((res) => setEvent(res.data));
    }
  }, [id]);

  if (!event) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p>Fecha: {new Date(event.date).toLocaleDateString()}</p>
      <p>Precio: ${event.price}</p>
    </div>
  );
}