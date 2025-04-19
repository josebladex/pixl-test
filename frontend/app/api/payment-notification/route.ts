import { Payment } from 'mercadopago';
import { mercadopago } from '../api';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body: { data: { id: string } } = await req.json();

  try {
    const payment = await new Payment(mercadopago).get({ id: body.data.id });

    if (!payment) {
      return new Response('Payment not found', { status: 404 });
    }

    const newStatus = payment.status === 'approved' ? 'APPROVED' : 'REJECTED';

    await prisma.transaction.updateMany({
      where: { paymentId: payment.id?.toString() },
      data: { status: newStatus },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Error handling payment notification:', error);
    return new Response(null, { status: 500 });
  }
}
