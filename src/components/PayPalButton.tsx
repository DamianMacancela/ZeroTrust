'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPalButton({ planId, onSuccess, onError }: { planId: string, onSuccess: () => void, onError: (err: string) => void }) {
  const [verifying, setVerifying] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAmA06uo1_3iEebrsu2b7onojjif_K6OoE5XY8-c4oPYSxx5vRnKzADPXHzD0Y1K0BOo48lqCoMN-ymIs';

  if (verifying) {
    return <div className="text-center text-sm font-bold text-blue-500 py-4">Procesando y encriptando entorno...</div>;
  }

  return (
    <div className="w-full relative z-10 min-h-[45px] bg-slate-800/20 rounded-xl p-2 border border-slate-700/30 flex items-center justify-center">
      <PayPalScriptProvider options={{ 
        clientId: clientId, 
        vault: true, 
        intent: 'subscription' 
      }}>
        <PayPalButtons
          forceReRender={[planId]}
          style={{
            shape: 'pill',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: planId
            });
          }}
          onApprove={async (data, actions) => {
            setVerifying(true);
            try {
              const res = await fetch('/api/checkout/paypal/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionID: data.subscriptionID })
              });
              const result = await res.json();
              setVerifying(false);
              
              if (result.success) {
                onSuccess();
              } else {
                onError(result.error || 'Error al validar suscripción.');
              }
            } catch (err) {
              setVerifying(false);
              onError('Error de conexión al verificar el pago.');
            }
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
