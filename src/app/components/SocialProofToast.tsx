"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

const notifications = [
  { name: "Estudio Jurídico (Quito)", action: "adquirió la Licencia Enterprise." },
  { name: "Clínica Privada (Guayaquil)", action: "censuró 1,200 historias clínicas." },
  { name: "Gerente de RRHH (Cuenca)", action: "completó una auditoría LOPDP." },
  { name: "Despacho de Abogados", action: "descargó la Checklist LOPDP." },
  { name: "Agencia de Marketing", action: "adquirió la Licencia Enterprise." }
];

export function SocialProofToast() {
  const [currentNotification, setCurrentNotification] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Wait 10 seconds before showing the first one
    const initialDelay = setTimeout(() => {
      showNextNotification();
    }, 10000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNextNotification = () => {
    const randomIndex = Math.floor(Math.random() * notifications.length);
    setCurrentNotification(randomIndex);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Show next one after 15 to 30 seconds
      const nextDelay = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      setTimeout(() => {
        showNextNotification();
      }, nextDelay);
      
    }, 5000);
  };

  if (!isVisible || currentNotification === null) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 pr-10 flex items-start gap-3 max-w-sm relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="bg-emerald-100 p-2 rounded-full shrink-0">
          <ShieldAlert className="w-5 h-5 text-emerald-600" />
        </div>
        
        <div>
          <p className="text-sm text-slate-900 leading-tight">
            <span className="font-bold">{notifications[currentNotification].name}</span> {notifications[currentNotification].action}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Hace unos minutos</p>
        </div>
      </div>
    </div>
  );
}
