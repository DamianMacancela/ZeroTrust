'use client';

import { useEffect, useState } from 'react';

export default function PayPalButton({ planId, onSuccess, onError }: { planId: string, onSuccess: () => void, onError: (err: string) => void }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAmA06uo1_3iEebrsu2b7onojjif_K6OoE5XY8-c4oPYSxx5vRnKzADPXHzD0Y1K0BOo48lqCoMN-ymIs';

  useEffect(() => {
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
      console.error("Fallo al cargar el script de PayPal SDK. Revisa tu ad-blocker o el CSP.");
      onError("Bloqueador de anuncios detectado. Desactiva tu ad-blocker para pagar con PayPal.");
    };
    document.body.appendChild(script);
  }, [clientId, onError]);

  useEffect(() => {
    if (scriptLoaded && (window as any).paypal) {
      const container = document.getElementById('paypal-button-container-enterprise');
      if (container) {
        container.innerHTML = ''; // Limpiar para evitar duplicados en React Strict Mode
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
            .catch(err => onError('Error de conexión al verificar el pago.'));
          }
        }).render('#paypal-button-container-enterprise');
      } catch (error) {
        console.error("Error renderizando PayPal", error);
      }
    }
  }, [scriptLoaded, planId, onSuccess, onError]);

  return (
    <div className="w-full relative z-10 min-h-[45px] bg-slate-800/20 rounded-xl p-4 border border-slate-700/30 flex flex-col items-center justify-center">
      {!scriptLoaded && <p className="text-center text-xs text-slate-400 font-bold mb-2">Conectando con PayPal...</p>}
      <div id="paypal-button-container-enterprise" className="w-full relative z-20"></div>
    </div>
  );
}
