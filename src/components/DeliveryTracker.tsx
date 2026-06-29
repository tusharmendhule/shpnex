import React, { useState, useEffect } from 'react';
import { Order } from '../types.js';
import { Truck, MapPin, Package, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

interface DeliveryTrackerProps {
  order: Order;
}

export default function DeliveryTracker({ order }: DeliveryTrackerProps) {
  const [eta, setEta] = useState('');
  const [progress, setProgress] = useState(0);
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Stable calculation for delivery simulation based on order creation date
  useEffect(() => {
    const orderIdHash = (order.id || order._id || 'shp').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const carriers = ['BlueDart Express', 'Delhivery Logistics', 'XpressBees', 'Amazon Shipping'];
    const chosenCarrier = carriers[orderIdHash % carriers.length];
    setCarrier(chosenCarrier);

    // Track number
    setTrackingNumber(`NEX-${100000 + (orderIdHash * 13) % 900000}-IN`);

    // Progress percentage & ETA based on order status
    switch (order.status) {
      case 'pending':
        setProgress(15);
        setEta('Arriving within 5-7 business days');
        break;
      case 'processing':
        setProgress(40);
        setEta('Arriving within 3-4 business days');
        break;
      case 'shipped':
        setProgress(70);
        setEta('Arriving within 1-2 business days');
        break;
      case 'delivered':
        setProgress(100);
        setEta('Delivered successfully');
        break;
      case 'cancelled':
        setProgress(0);
        setEta('Order Cancelled');
        break;
      default:
        setProgress(15);
        setEta('Processing delivery timeline...');
    }
  }, [order]);

  const steps = [
    { title: 'Order Confirmed', desc: 'Sellers accepted the order request', val: 15, icon: Package },
    { title: 'Hub Dispatch', desc: 'Package leaves coordinates warehouse', val: 40, icon: Truck },
    { title: 'In Transit', desc: 'En route to local delivery center', val: 70, icon: Clock },
    { title: 'Delivered', desc: 'Handed over securely to client', val: 100, icon: ShieldCheck },
  ];

  if (order.status === 'cancelled') {
    return (
      <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-5 text-center">
        <p className="text-xs font-bold text-rose-500">❌ Shipping and tracking coordinates cancelled for this order.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm font-sans mt-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800/60">
        <div>
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-500" /> Active Delivery Tracking
          </h3>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wide mt-1">
            Carrier: <span className="text-zinc-700 dark:text-zinc-300">{carrier}</span> | tracking: <span className="text-zinc-700 dark:text-zinc-300">{trackingNumber}</span>
          </p>
        </div>
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl px-4 py-2.5 text-right md:text-right flex items-center gap-2.5">
          <Clock className="h-5 w-5 text-emerald-500" />
          <div className="text-left">
            <p className="text-[9px] text-emerald-500/80 font-extrabold uppercase tracking-widest">ESTIMATED ARRIVAL</p>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{eta}</p>
          </div>
        </div>
      </div>

      {/* Interactive visual timeline bar */}
      <div className="my-8 relative">
        <div className="absolute top-5 left-6 right-6 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000" 
            style={{ width: `${Math.max(0, (progress - 15) / 85 * 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-4 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = progress >= step.val;
            const isCurrent = order.status === 'pending' && idx === 0 || 
                              order.status === 'processing' && idx === 1 || 
                              order.status === 'shipped' && idx === 2 || 
                              order.status === 'delivered' && idx === 3;

            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow shadow-emerald-500/20' 
                    : isCurrent
                    ? 'border-emerald-500 bg-white dark:bg-zinc-900 text-emerald-500 animate-pulse'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className={`text-[10px] font-extrabold mt-3 tracking-tight ${isCompleted || isCurrent ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}>
                  {step.title}
                </h4>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium max-w-[80px] mt-0.5 leading-tight hidden sm:block">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time route tracking animation canvas / graphic */}
      <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 relative overflow-hidden flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Animated delivery route vector map */}
        <div className="relative h-28 md:w-3/5 w-full border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Soft grid lines for technical feeling */}
            <line x1="50" y1="0" x2="50" y2="120" stroke="#f4f4f5" strokeWidth="1" className="dark:stroke-zinc-800/40" />
            <line x1="150" y1="0" x2="150" y2="120" stroke="#f4f4f5" strokeWidth="1" className="dark:stroke-zinc-800/40" />
            <line x1="250" y1="0" x2="250" y2="120" stroke="#f4f4f5" strokeWidth="1" className="dark:stroke-zinc-800/40" />
            <line x1="350" y1="0" x2="350" y2="120" stroke="#f4f4f5" strokeWidth="1" className="dark:stroke-zinc-800/40" />

            {/* Path */}
            <path 
              d="M 50,60 C 120,30 180,90 250,40 C 290,20 310,80 350,60" 
              fill="none" 
              stroke="#e4e4e7" 
              strokeWidth="4" 
              strokeLinecap="round"
              className="dark:stroke-zinc-800"
            />

            {/* Progress Path */}
            {progress > 15 && (
              <path 
                d="M 50,60 C 120,30 180,90 250,40 C 290,20 310,80 350,60" 
                fill="none" 
                stroke="url(#routeGradient)" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="400"
                strokeDashoffset={`${400 - (progress - 15) / 85 * 400}`}
                className="transition-all duration-1000"
              />
            )}

            {/* Source Node */}
            <circle cx="50" cy="60" r="6" fill="#10b981" />
            <circle cx="50" cy="60" r="12" fill="#10b981" fillOpacity="0.1" className="animate-ping" />
            <text x="50" y="85" textAnchor="middle" fill="#71717a" fontSize="8" fontWeight="bold">ShpNex Hub</text>

            {/* Destination Node */}
            <circle cx="350" cy="60" r="6" fill="#14b8a6" />
            <circle cx="350" cy="60" r="12" fill="#14b8a6" fillOpacity="0.1" className="animate-ping" />
            <text x="350" y="85" textAnchor="middle" fill="#71717a" fontSize="8" fontWeight="bold">Home</text>

            {/* Delivery truck moving along route */}
            {progress > 15 && progress < 100 && (
              <g className="animate-pulse">
                <circle cx={`${50 + (progress - 15) / 85 * 300}`} cy={`${60 + Math.sin((progress - 15) / 85 * Math.PI * 2) * 15}`} r="5" fill="#10b981" />
              </g>
            )}
          </svg>
        </div>

        {/* Detailed Shipping Info */}
        <div className="flex-1 md:pl-4 text-xs font-semibold space-y-2">
          <div className="flex justify-between text-zinc-500">
            <span>Shipping Route:</span>
            <span className="text-zinc-800 dark:text-zinc-200">Mumbai Central ➜ {order.shippingAddress.city}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>In-Transit Coordinates:</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">
              {order.status === 'delivered' 
                ? 'Arrived (0.00km)' 
                : order.status === 'shipped' 
                ? 'Local Hub (ETA < 24h)' 
                : order.status === 'processing'
                ? 'Sellers Hub'
                : 'Awaiting Pickup'}
            </span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Recipient Details:</span>
            <span className="text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">{order.shippingAddress.street}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
