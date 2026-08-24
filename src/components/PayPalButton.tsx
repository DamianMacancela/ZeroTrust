'use client';

import { useEffect, useState } from 'react';

export default function PayPalButton({ planId, onSuccess, onError }: { planId: string, onSuccess: () => void, onError: (err: string) => void }) {
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
          onError("El módulo de pago no está configurado. Contacta a soporte.");
        }
      })
      .catch(() => {
        onError("No se pudo conectar con el servidor de pagos.");
      });
  }, [clientId, onError]);

  // 2. Cargar script de PayPal SDK
  useEffect(() => {
    if (!clientId) return;

    if (document.getElementById('paypal-sdk-raw')) {
      setScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'paypal-sdk-raw';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error("Fallo al cargar el script de PayPal SDK.");
      onError("Bloqueador de anuncios detectado. Desactívalo para pagar con PayPal.");
    };
    document.body.appendChild(script);
  }, [clientId, onError]);

  // 3. Renderizar botones de PayPal
  useEffect(() => {
    if (scriptLoaded && (window as any).paypal && clientId) {
      const container = document.getElementById('paypal-button-container-enterprise');
      if (container) {
        container.innerHTML = '';
      }
      
      try {
        (window as any).paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: planId
            });
          },
          onApprove: function(data: any, actions: any) {
            fetch('/api/checkout/paypal/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscriptionID: data.subscriptionID })
            })
            .then(res => res.json())
            .then(result => {
              if (result.success) onSuccess();
              else onError(result.error || 'Error al validar suscripción.');
            })
            .catch(() => onError('Error de conexión al verificar el pago.'));
          }
        }).render('#paypal-button-container-enterprise');
      } catch (error) {
        console.error("Error renderizando PayPal", error);
      }
    }
  }, [scriptLoaded, clientId, planId, onSuccess, onError]);

  return (
    <div className="w-full relative z-10 min-h-[45px] bg-slate-800/20 rounded-xl p-4 border border-slate-700/30 flex flex-col items-center justify-center">
      {!scriptLoaded && <p className="text-center text-xs text-slate-400 font-bold mb-2">Conectando con PayPal...</p>}
      <div id="paypal-button-container-enterprise" className="w-full relative z-20"></div>
    </div>
  );
}
