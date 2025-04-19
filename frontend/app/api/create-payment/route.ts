import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId, eventId } = await req.json();

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const preferencePayload = {
      items: [
        {
          title: event.title,
          description: event.description,
          quantity: 1,
          currency_id: 'USD',
          unit_price: parseFloat(event.price.toString()),
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/payment-success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/payment-failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/payment-pending`,
      },
      auto_return: 'approved',
      metadata: {
        userId,
        eventId,
      },
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferencePayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al crear la preferencia de pago: ${errorData}`);
    }

    const preference = await response.json();

    await prisma.transaction.create({
      data: {
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
        paymentId: preference.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (error) {
    console.error('Error creating payment preference:', error);
    return NextResponse.json({ error: 'Failed to create payment preference' }, { status: 500 });
  }
}
