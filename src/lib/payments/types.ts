/**
 * IPaymentGateway — Contrato Strategy para pasarelas de pago.
 * 
 * Cualquier gateway (MercadoPago, LemonSqueezy, Stripe, etc.) 
 * debe implementar esta interfaz para ser intercambiable via Factory.
 * 
 * @see factory.ts para la selección dinámica por env var.
 */

/** Resultado de crear una sesión de checkout */
export interface CheckoutResult {
  /** URL a la que redirigir al usuario para completar el pago */
  redirectUrl: string;
}

/** Resultado de procesar un webhook */
export interface WebhookResult {
  /** true si el evento fue procesado correctamente */
  success: boolean;
  /** Tipo de evento procesado (ej: subscription_created) */
  eventType?: string;
  /** Mensaje de error si success === false */
  error?: string;
}

/** Opciones para crear un checkout */
export interface CheckoutOptions {
  /** Email del comprador (opcional, prefill) */
  email?: string;
  /** Metadata custom para asociar al pago */
  customData?: Record<string, string>;
  /** URL de retorno tras pago exitoso */
  successUrl?: string;
  /** URL de retorno tras cancelación */
  cancelUrl?: string;
}

/** Interfaz principal del Strategy Pattern */
export interface IPaymentGateway {
  /** Nombre identificador del gateway (para logs y auditoría) */
  readonly name: string;

  /**
   * Crea una sesión de checkout y devuelve la URL de redirección.
   * @throws Error si la configuración del gateway es incompleta.
   */
  createCheckoutSession(options: CheckoutOptions): Promise<CheckoutResult>;

  /**
   * Verifica la firma criptográfica de un webhook entrante.
   * @returns true si la firma es válida.
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean;

  /**
   * Procesa el payload de un webhook ya verificado.
   * Debe ser idempotente: si el mismo evento llega dos veces,
   * no debe duplicar registros en la DB.
   */
  handleWebhookEvent(payload: Record<string, unknown>): Promise<WebhookResult>;
}

/** Gateways soportados */
export type GatewayType = 'MERCADOPAGO' | 'LEMONSQUEEZY' | 'DIRECT';
