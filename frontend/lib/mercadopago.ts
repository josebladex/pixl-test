import { MercadoPagoConfig } from 'mercadopago';

const mercadoPago_client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 },
});

export default mercadoPago_client;
