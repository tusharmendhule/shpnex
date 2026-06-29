import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Landmark, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  QrCode
} from 'lucide-react';

interface PaymentGatewayViewProps {
  orderId: string;
  onNavigate: (view: string, id?: string) => void;
}

export default function PaymentGatewayView({ orderId, onNavigate }: PaymentGatewayViewProps) {
  const { payOrder, clearCart, token } = useApp();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab State: card, upi, netbanking
  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'netbanking'>('card');
  
  // Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  // Processing States
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'otp_verification' | 'success'>('idle');
  const [processingStatus, setProcessingStatus] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');

  // Fetch Order details for payment total
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !orderId) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError('Failed to load transaction details.');
        }
      } catch (err) {
        setError('Connection lost while retrieving invoice values.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, token]);

  // Card validation & styling helpers
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^6(0|5|8)/.test(cleanNumber)) return 'rupay';
    return 'generic';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (activeTab === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardName) {
        setError('Please enter the cardholder name.');
        return;
      }
      if (cardExpiry.length < 5) {
        setError('Please enter card expiry in MM/YY format.');
        return;
      }
      if (cardCvv.length < 3) {
        setError('Please enter a valid 3-digit CVV.');
        return;
      }
    } else if (activeTab === 'upi') {
      if (!upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    } else if (activeTab === 'netbanking') {
      if (!selectedBank) {
        setError('Please select an issuing bank to proceed.');
        return;
      }
    }

    setError('');
    setPaymentStep('processing');
    
    // Simulate payment clearing network processing steps
    const steps = [
      'Establishing SSL connection layer with NexPay Gateway...',
      'Verifying merchant certificates and compliance...',
      'Routing authorization query to central banking nodes...',
      'Requiring additional multi-factor verification (3D Secure)...'
    ];

    let currentStepIdx = 0;
    setProcessingStatus(steps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setProcessingStatus(steps[currentStepIdx]);
      } else {
        clearInterval(interval);
        // Generate random 6 digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setOtpCode('');
        setOtpTimer(60);
        setPaymentStep('otp_verification');
      }
    }, 1000);
  };

  // OTP Timer countdown
  useEffect(() => {
    let timer: any;
    if (paymentStep === 'otp_verification' && otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [paymentStep, otpTimer]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode !== generatedOtp) {
      setOtpError('Invalid authorization PIN. Please check the mock code provided.');
      return;
    }

    setOtpError('');
    setPaymentStep('processing');
    setProcessingStatus('Settling ledger coordinates & registering payment...');

    // Call the server-side API to transition order status to paid
    try {
      const success = await payOrder(orderId, 'NEXPAY_SIM_' + Math.random().toString(36).substring(2, 11).toUpperCase());
      if (success) {
        setTimeout(() => {
          clearCart();
          setPaymentStep('success');
          setTimeout(() => {
            onNavigate('order-success', orderId);
          }, 1800);
        }, 1200);
      } else {
        setError('Ledger write failed. Your money was not debited.');
        setPaymentStep('idle');
      }
    } catch (err) {
      setError('An error occurred during transaction logging.');
      setPaymentStep('idle');
    }
  };

  const cardType = getCardType(cardNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col items-center justify-center font-sans">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Securing Session Tunnel...</p>
      </div>
    );
  }

  const roundedTotal = order ? Math.round(order.totalPrice) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-850 dark:text-zinc-100 font-sans py-12 px-4 relative flex flex-col justify-between overflow-hidden transition-colors duration-300">
      {/* Background graphic nodes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full relative z-10 flex-grow flex flex-col justify-center">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-2xl border border-emerald-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                NexPay <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Secure Gateway</span>
              </h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">PCI-DSS Level 1 Encrypted Terminal</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('checkout')}
            className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Merchant
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Dynamic Views depending on Payment Step */}
        {paymentStep === 'processing' && (
          <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl p-10 text-center flex flex-col items-center justify-center py-20 min-h-[450px] shadow-sm">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-6" />
            <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2">Authorizing Transaction</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed animate-pulse">
              {processingStatus}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider mt-12">Do not refresh or click the back button.</p>
          </div>
        )}

        {paymentStep === 'otp_verification' && (
          <div className="bg-white text-zinc-900 rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto w-full border border-zinc-200">
            {/* Bank branding */}
            <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">3D Secure Validation</span>
                <h3 className="text-xs font-extrabold text-zinc-800">CENTRAL SECURE DEPOSIT</h3>
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> SECURE
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="p-6 space-y-5">
              <div className="text-xs space-y-2 text-zinc-600">
                <div className="flex justify-between pb-2 border-b border-zinc-100">
                  <span>Merchant:</span>
                  <span className="font-bold text-zinc-900">ShpNex India Commerce</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-100">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-[10px] text-zinc-800 font-bold">TXN-{orderId.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Debited:</span>
                  <span className="font-bold text-zinc-900">₹{roundedTotal}.00 INR</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                  🔒 Use the simulated test code below to authenticate this checkout:
                </p>
                <div className="mt-2 text-lg font-black tracking-widest text-emerald-600 select-all">
                  {generatedOtp} <span className="text-[10px] font-normal tracking-normal text-emerald-500">(or enter <span className="font-bold underline">123456</span>)</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1.5">Enter 6-Digit Security Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="******"
                  className="w-full text-center bg-zinc-50 border border-zinc-200 rounded-xl text-lg tracking-[8px] py-2.5 font-bold outline-none focus:border-emerald-500 focus:bg-white text-zinc-900"
                />
                {otpError && <p className="text-[10px] text-rose-500 font-bold mt-1.5">{otpError}</p>}
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2">
                <span>Resend OTP available in: <strong className="text-zinc-800 font-bold">{otpTimer > 0 ? `${otpTimer}s` : 'Now'}</strong></span>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={() => {
                    setOtpTimer(60);
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(code);
                  }}
                  className={`font-bold transition-colors ${otpTimer > 0 ? 'text-zinc-300 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'}`}
                >
                  Resend PIN
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentStep('idle')}
                  className="flex-1 py-3 text-xs font-bold border border-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
                >
                  Cancel Transaction
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl p-10 text-center flex flex-col items-center justify-center py-20 min-h-[450px] shadow-sm">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-1.5">Payment Completed</h2>
            <p className="text-xs text-emerald-500 font-bold">Secure Settlement Successful</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-6 max-w-sm mx-auto leading-relaxed">
              Redirecting you back to the ShpNex merchant applet order confirmation dashboard...
            </p>
          </div>
        )}

        {paymentStep === 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: options and forms */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl overflow-hidden p-6 sm:p-8 shadow-sm">
              {/* Payment Tabs */}
              <div className="grid grid-cols-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1 mb-8">
                <button
                  onClick={() => { setActiveTab('card'); setError(''); }}
                  className={`py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'card' 
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" /> Card Pay
                </button>
                <button
                  onClick={() => { setActiveTab('upi'); setError(''); }}
                  className={`py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'upi' 
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> UPI Apps
                </button>
                <button
                  onClick={() => { setActiveTab('netbanking'); setError(''); }}
                  className={`py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'netbanking' 
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  <Landmark className="h-3.5 w-3.5" /> Net Banking
                </button>
              </div>

              <form onSubmit={handleStartPayment} className="space-y-6">
                {/* CARD TAB */}
                {activeTab === 'card' && (
                  <div className="space-y-5">
                    {/* Visual Card component preview */}
                    <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-700/50 p-5 relative overflow-hidden flex flex-col justify-between text-white shadow-xl">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#10b98110,transparent_60%)]" />
                      <div className="flex justify-between items-start">
                        {/* Chip Graphic */}
                        <div className="h-8 w-11 rounded-md bg-yellow-600/30 border border-yellow-500/20 relative">
                          <div className="absolute top-1 left-2 right-2 bottom-1 border border-yellow-500/10 grid grid-cols-3 gap-0.5" />
                        </div>
                        {/* Card Brand */}
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950/40 px-2 py-1 rounded-md">
                          {cardType === 'visa' && 'VISA Secure'}
                          {cardType === 'mastercard' && 'MasterCard ID'}
                          {cardType === 'rupay' && 'RuPay Pay'}
                          {cardType === 'generic' && 'Dual Network'}
                        </span>
                      </div>

                      <div>
                        {/* Number */}
                        <p className="text-base font-mono font-bold tracking-[3px] text-zinc-200">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-widest">Card Holder</p>
                          <p className="text-xs font-bold text-zinc-300 truncate max-w-[150px]">{cardName.toUpperCase() || 'CLIENT HOLDER'}</p>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-widest">Expires</p>
                            <p className="text-xs font-mono font-bold text-zinc-300">{cardExpiry || 'MM/YY'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-widest">CVV</p>
                            <p className="text-xs font-mono font-bold text-zinc-300">{cardCvv || '•••'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Form inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4000 1234 5678 9010"
                          maxLength={19}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 font-semibold outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                          placeholder="Tushar"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 font-semibold outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 font-semibold outline-none focus:border-emerald-500 text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Security Code (CVV)</label>
                          <input
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 font-semibold outline-none focus:border-emerald-500 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI TAB */}
                {activeTab === 'upi' && (
                  <div className="space-y-6">
                    {/* QR SCAN ANIMATION SIMULATOR */}
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5">
                      <div className="p-3 bg-white rounded-2xl flex items-center justify-center relative shadow-lg">
                        <QrCode className="h-32 w-32 text-zinc-950" strokeWidth={1.5} />
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 animate-bounce mt-4 mx-4" />
                      </div>
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white flex items-center justify-center md:justify-start gap-1.5">
                          Scan to Pay via UPI App
                        </h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          Scan this dynamically generated transaction QR using Google Pay, PhonePe, Paytm, or BHIM to pay instantly.
                        </p>
                        <div className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400">
                          Secure Link ID: <span className="text-emerald-500">nexpay-order-{orderId.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200 dark:border-zinc-800/60"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-500 dark:text-zinc-400 font-bold text-[9px] tracking-wider">or enter VPA address</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Your UPI VPA ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="customername@okaxis"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* NET BANKING TAB */}
                {activeTab === 'netbanking' && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Select Issuing Bank</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      {[
                        { name: 'HDFC Bank', code: 'hdfc', color: 'border-blue-500/20 hover:border-blue-500/60' },
                        { name: 'ICICI Bank', code: 'icici', color: 'border-orange-500/20 hover:border-orange-500/60' },
                        { name: 'State Bank of India', code: 'sbi', color: 'border-sky-500/20 hover:border-sky-500/60' },
                        { name: 'Axis Bank', code: 'axis', color: 'border-purple-500/20 hover:border-purple-500/60' },
                      ].map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => setSelectedBank(bank.code)}
                          className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border text-left flex flex-col justify-between h-20 transition-all active:scale-95 cursor-pointer ${
                            selectedBank === bank.code 
                              ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/5' 
                              : `border-zinc-200 dark:border-zinc-850 ${bank.color}`
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Corporate</span>
                          <span className="text-xs font-bold text-zinc-800 dark:text-white">{bank.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-emerald-500/5 cursor-pointer"
                >
                  <Lock className="h-4 w-4" strokeWidth={2.5} /> Authopay ₹{roundedTotal}.00 INR
                </button>
              </form>
            </div>

            {/* Right side: transaction detail card summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl p-6 space-y-5 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Order Manifest Invoice</h3>
                
                {order && (
                  <div className="space-y-4">
                    {/* Items loop */}
                    <div className="max-h-36 overflow-y-auto space-y-2.5 pr-2">
                      {order.orderItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2 max-w-[180px]">
                            <span className="text-zinc-400 dark:text-zinc-500 font-bold">{item.quantity}x</span>
                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate">{item.name}</span>
                          </div>
                          <span className="text-zinc-500 dark:text-zinc-400 font-mono">₹{Math.round(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-400 dark:text-zinc-500 font-bold">
                        <span>Cart Subtotal</span>
                        <span className="font-mono text-zinc-600 dark:text-zinc-300">₹{Math.round(order.itemsPrice)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400 dark:text-zinc-500 font-bold">
                        <span>Local Logistics Shipping</span>
                        <span className="font-mono text-zinc-600 dark:text-zinc-300">{order.shippingPrice > 0 ? `₹${Math.round(order.shippingPrice)}` : 'FREE'}</span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 flex justify-between items-center">
                      <span className="text-xs font-black text-zinc-800 dark:text-white uppercase tracking-wider">Total Ledger Amount</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-500 font-mono">₹{roundedTotal}.00</span>
                    </div>
                  </div>
                )}

                {/* Escrow badge */}
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-zinc-800 dark:text-white tracking-wider">NexPay Guarantee</h4>
                    <p className="text-[9px] text-zinc-500 dark:text-zinc-400 leading-normal mt-0.5">
                      Your transactional funds are protected by end-to-end sandbox certificates. Security logs are stored locally.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance details */}
              <div className="text-[9px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider text-center space-y-1">
                <p>⚡ Gateway powered by SSL encryption certificates</p>
                <p>compliance ID: NEXP-3000-CL-RUN-OK</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold tracking-wide border-t border-zinc-200 dark:border-zinc-900 pt-6 mt-8">
        © {new Date().getFullYear()} NexPay Solutions India Ltd. All rights reserved. Registered ISO-9001 and PCI-DSS Compliant.
      </div>
    </div>
  );
}
