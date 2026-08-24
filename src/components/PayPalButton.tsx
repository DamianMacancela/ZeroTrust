'use client';

import { useEffect, useState, useRef } from 'react';

interface PayPalButtonProps {
  planId?: string;
  onSuccess: () => void;
  onError: (err: string) => void;
}

export default function PayPalButton({ 
  planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || "P-7N588285294329012NJZH4EQ", 
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [clientId, setClientId] = useState<string | null>(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isRenderedRef = useRef(false);
  
  // Guardamos callbacks en refs para evitar re-renders cíclicos por dependencias de funciones
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  // 1. Obtener Client ID desde la API si no viene por env pública
  useEffect(() => {
    let isMounted = true;
    if (clientId) return;

    fetch('/api/checkout/paypal/config')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.clientId) {
          setClientId(data.clientId);
        } else {
          setLoadError("Configuración de PayPal no encontrada.");
          onErrorRef.current("Configuración de PayPal no encontrada.");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("Error conectando con el servidor de pagos.");
        onErrorRef.current("Error conectando con el servidor de pagos.");
      });

    return () => { isMounted = false; };
  }, [clientId]);

  // 2. Cargar el script del SDK de PayPal una sola vez
  useEffect(() => {
    if (!clientId) return;

    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
      script.async = true;
      script.onload = () => {
        setIsInitializing(false);
      };
      script.onerror = () => {
        setLoadError("Bloqueador de anuncios detectado. Desactívalo para pagar con PayPal.");
        onErrorRef.current("Bloqueador de anuncios detectado.");
      };
      document.head.appendChild(script);
    } else {
      // Si el script ya existe, verificar si paypal ya está en window
      if ((window as any).paypal) {
        setIsInitializing(false);
      } else {
        script.addEventListener('load', () => setIsInitializing(false));
      }
    }
  }, [clientId]);

  // 3. Renderizar el botón en el contenedor con protección contra doble render y desmontaje
  useEffect(() => {
    let isMounted = true;

    const renderButton = () => {
      const container = containerRef.current;
      const paypal = (window as any).paypal;

      if (!container || !paypal || isRenderedRef.current || !clientId) {
        return;
      }

      // Si ya tiene contenido renderizado por PayPal, no duplicar
      if (container.children.length > 0) {
        return;
      }

      try {
        isRenderedRef.current = true;

        paypal.Buttons({
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
          onApprove: function(data: any) {
            fetch('/api/checkout/paypal/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscriptionID: data.subscriptionID })
            })
            .then(res => res.json())
            .then(result => {
              if (!isMounted) return;
              if (result.success) {
                onSuccessRef.current();
              } else {
                onErrorRef.current(result.error || 'Error al validar la suscripción.');
              }
            })
            .catch(() => {
              if (isMounted) onErrorRef.current('Error de conexión al verificar el pago.');
            });
          },
          onError: function(err: any) {
            console.error("[PayPal Button Error]", err);
            isRenderedRef.current = false;
          }
        }).render(container).catch((err: any) => {
          console.warn("[PayPal Render Warning]", err);
          isRenderedRef.current = false;
        });

      } catch (err) {
        console.error("Error al inicializar botones de PayPal:", err);
        isRenderedRef.current = false;
      }
    };

    // Intentar renderizar si ya está listo
    if (!isInitializing) {
      renderButton();
    } else {
      // Reintentar periódicamente hasta que paypal esté disponible en window
      const interval = setInterval(() => {
        if ((window as any).paypal && containerRef.current) {
          clearInterval(interval);
          renderButton();
        }
      }, 300);

      return () => {
        clearInterval(interval);
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
  }, [clientId, isInitializing, planId]);

  return (
    <div className="w-full relative z-10 min-h-[48px] bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 flex flex-col items-center justify-center">
      {loadError ? (
        <p className="text-center text-xs text-red-400 font-bold py-1">
          {loadError}
        </p>
      ) : (
        <>
          {/* Spinner visible mientras carga */}
          {(!isRenderedRef.current || isInitializing) && (
            <div className="flex items-center gap-2 py-2 text-xs font-bold text-slate-400">
              <div className="w-3.5 h-3.5 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
              <span>Conectando con PayPal...</span>
            </div>
          )}
          {/* Contenedor persistente con ref directo */}
          <div ref={containerRef} className="w-full relative z-20"></div>
        </>
      )}
    </div>
  );
}
