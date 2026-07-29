/**
 * PaymentGatewayFactory — Selecciona la implementación concreta de IPaymentGateway
 * según la variable de entorno ACTIVE_PAYMENT_GATEWAY.
 * 
 * Uso:
 *   const gateway = PaymentGatewayFactory.create();
 *   const { redirectUrl } = await gateway.createCheckoutSession({ ... });
 */

import type { IPaymentGateway, GatewayType } from './types';
import { MercadoPagoGateway } from './mercadopago.gateway';
import { LemonSqueezyGateway } from './lemonsqueezy.gateway';

export class PaymentGatewayFactory {
  /**
   * Crea la instancia del gateway activo.
   * @throws Error si el tipo de gateway no es soportado.
   */
  static create(override?: GatewayType): IPaymentGateway {
    const gatewayType = (override || process.env.ACTIVE_PAYMENT_GATEWAY || 'LEMONSQUEEZY') as GatewayType;

    switch (gatewayType) {
      case 'MERCADOPAGO':
        return new MercadoPagoGateway();

      case 'LEMONSQUEEZY':
        return new LemonSqueezyGateway();

      case 'DIRECT':
        // DIRECT no es un gateway real — se maneja como redirect en el checkout route
        throw new Error('DIRECT gateway no soporta createCheckoutSession(). Use DIRECT_CHECKOUT_URL en el endpoint de checkout.');

      default:
        throw new Error(`Gateway no soportado: ${gatewayType}. Use MERCADOPAGO, LEMONSQUEEZY o DIRECT.`);
    }
  }

  /**
   * Devuelve el tipo de gateway activo (para logging/auditoría).
   */
  static getActiveType(): GatewayType {
    return (process.env.ACTIVE_PAYMENT_GATEWAY || 'LEMONSQUEEZY') as GatewayType;
  }
}
