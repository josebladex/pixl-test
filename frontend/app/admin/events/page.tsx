'use client';

import { useState } from 'react';
import { createEvent } from '@/actions/events';

export default function AdminEvents() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        title,
        description,
        date,
        price: parseFloat(price),
      });
      alert('Evento creado');
      setTitle('');
      setDescription('');
      setDate('');
      setPrice('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Administrar Eventos</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del evento"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleCreateEvent}
        className="bg-green-500 text-white px-4 py-2"
      >
        Crear Evento
      </button>
    </div>
  );
}