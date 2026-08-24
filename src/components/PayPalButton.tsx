'use client';

import { useEffect, useState } from 'react';

interface PayPalButtonProps {
  amount?: string; // '215.90' para anual, '19.99' para mensual
  planType?: 'annual' | 'monthly';
  planId?: string;
  onSuccess: () => void;
  onError: (err: string) => void;
}

export default function PayPalButton({ 
  amount = '215.90', 
  planType = 'annual', 
  planId, 
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [clientId, setClientId] = useState<string | null>(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || null);

  // 1. Obtener Client ID desde el backend o env local
  useEffect(() => {
    if (clientId) return;

    fetch('/api/checkout/paypal/config')
      .then(res => res.json())
      .then(data => {
        if (data.clientId) {
          setClientId(data.clientId);
        } else {
          onError("El módulo de pago no está configurado.");
        }
      })
      .catch(() => {
        onError("No se pudo conectar con el servidor de pagos.");
      });
  }, [clientId, onError]);

  // 2. Cargar script de PayPal SDK
  useEffect(() => {
    if (!clientId) return;

    // Remover script previo si cambia el intent o currency
    const existingScript = document.getElementById('paypal-sdk-raw');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'paypal-sdk-raw';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error("Fallo al cargar el script de PayPal SDK.");
      onError("Bloqueador de anuncios detectado. Desactívalo para pagar con PayPal.");
    };
    document.body.appendChild(script);
  }, [clientId, onError]);

  // 3. Renderizar botones de PayPal para el monto exacto
  useEffect(() => {
    if (scriptLoaded && (window as any).paypal && clientId) {
      const containerId = `paypal-button-container-${planType}`;
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
      
      try {
        (window as any).paypal.Buttons({
          style: {
            shape: 'pill',
            color: planType === 'annual' ? 'gold' : 'blue',
            layout: 'vertical',
            label: 'pay'
          },
          createOrder: function(data: any, actions: any) {
            return actions.order.create({
              purchase_units: [{
                description: `ZeroTrust Redact Enterprise — ${planType === 'annual' ? 'Licencia Anual ($215.90 con 10% OFF)' : 'Licencia Mensual ($19.99/mes)'}`,
                amount: {
                  currency_code: 'USD',
                  value: amount
                }
              }]
            });
          },
          onApprove: async function(data: any, actions: any) {
            try {
              const capture = await actions.order.capture();
              
              const response = await fetch('/api/checkout/paypal/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderID, capture })
              });

              const result = await response.json();
              if (result.success) {
                onSuccess();
              } else {
                onError(result.error || 'Error al validar el pago.');
              }
            } catch (err) {
              console.error("Error capturando orden de PayPal:", err);
              onError('Error procesando la transacción con PayPal.');
            }
          },
          onError: function(err: any) {
            console.error("PayPal button error:", err);
            onError("Ocurrió un error en la pasarela de PayPal.");
          }
        }).render(`#${containerId}`);
      } catch (error) {
        console.error("Error renderizando PayPal", error);
      }
    }
  }, [scriptLoaded, clientId, amount, planType, onSuccess, onError]);

  const containerId = `paypal-button-container-${planType}`;

  return (
    <div className="w-full relative z-10 min-h-[45px] bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 flex flex-col items-center justify-center">
      {!scriptLoaded && (
        <p className="text-center text-xs text-slate-400 font-bold py-2 animate-pulse">
          Conectando con pasarela segura de PayPal...
        </p>
      )}
      <div id={containerId} className="w-full relative z-20"></div>
    </div>
  );
}
