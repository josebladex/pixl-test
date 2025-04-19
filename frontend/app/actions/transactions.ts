'use server';

import prisma from '@/lib/prisma';

interface MercadoPagoPreference {
  id: string;
  init_point: string;
}

export async function createPaymentPreferenceAction(data: { userId: number; eventId: number }) {
  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event) {
    throw new Error('Evento no encontrado');
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
      success: process.env.MERCADOPAGO_SUCCESS_URL || 'http://localhost:3000/payment-success',
      failure: process.env.MERCADOPAGO_FAILURE_URL || 'http://localhost:3000/payment-failure',
      pending: process.env.MERCADOPAGO_PENDING_URL || 'http://localhost:3000/payment-pending',
    },
    auto_return: 'approved',
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preferencePayload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al crear la preferencia de pago: ${errorData}`);
  }

  const preference: MercadoPagoPreference = await response.json();

  const transaction = await prisma.transaction.create({
    data: {
      user: { connect: { id: data.userId } },
      event: { connect: { id: data.eventId } },
      paymentId: preference.id,
    },
  });

  return {
    preferenceId: preference.id,
    initPoint: preference.init_point,
    transactionId: transaction.id,
  };
}

export async function updateTransactionStatusAction(
  paymentId: string,
  newStatus: 'APPROVED' | 'REJECTED'
) {
  const updatedTransaction = await prisma.transaction.update({
    where: { id: parseInt(paymentId) },
    data: { status: newStatus },
  });

  return updatedTransaction;
}
