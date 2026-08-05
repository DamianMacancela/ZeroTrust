'use client';

import { useEffect, useRef, useState } from 'react';

export default function PayPalButton({ planId, onSuccess, onError }: { planId: string, onSuccess: () => void, onError: (err: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAmA06uo1_3iEebrsu2b7onojjif_K6OoE5XY8-c4oPYSxx5vRnKzADPXHzD0Y1K0BOo48lqCoMN-ymIs';
    if (!clientId) return;

    // Avoid loading multiple times
    if (document.getElementById('paypal-sdk-script')) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.dataset.sdkIntegrationSource = 'button-factory';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Don't remove the script to prevent re-rendering issues, but clean up button if needed
    };
  }, []);

  useEffect(() => {
    if (loaded && containerRef.current && (window as any).paypal) {
      // Clear container to prevent duplicate buttons in React Strict Mode
      containerRef.current.innerHTML = '';

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
          setVerifying(true);
          // Verify with our secure backend
          fetch('/api/checkout/paypal/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionID: data.subscriptionID })
          })
          .then(res => res.json())
          .then(data => {
            setVerifying(false);
            if (data.success) {
              onSuccess();
            } else {
              onError(data.error || 'Error al validar suscripción.');
            }
          })
          .catch(err => {
            setVerifying(false);
            onError('Error de conexión al verificar el pago.');
          });
        }
      }).render(containerRef.current);
    }
  }, [loaded, planId, onSuccess, onError]);

  if (verifying) {
    return <div className="text-center text-sm font-bold text-blue-500 py-4">Procesando y encriptando entorno...</div>;
  }

  return <div ref={containerRef} className="w-full relative z-10 min-h-[45px]"></div>;
}
