import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, Copy, RefreshCw, Smartphone, QrCode, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ORDER_SUCCESS_SOUND } from '../constants/sounds';

const UPI_ID = 'adarshathapa31-7@okaxis';
const MERCHANT_NAME = 'Strong Cup';

const UPI_APPS = [
  { id: 'phonepe', name: 'PhonePe', icon: 'https://cdn-icons-png.flaticon.com/512/11024/11024792.png' },
  { id: 'paytm', name: 'Paytm', icon: 'https://cdn-icons-png.flaticon.com/512/825/825508.png' },
  { id: 'gpay', name: 'Google Pay', icon: 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png' },
  { id: 'other', name: 'Other UPI', icon: 'https://cdn-icons-png.flaticon.com/512/6124/6124997.png' }
];

const Payment: React.FC = () => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [paymentStep, setPaymentStep] = useState<'select' | 'redirecting' | 'verifying' | 'qr'>(isMobile ? 'select' : 'qr');
  const [selectedApp, setSelectedApp] = useState<typeof UPI_APPS[0] | null>(null);
  
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [qrKey, setQrKey] = useState(0); // Used to force refresh QR
  
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate('/cart');
    }
  }, [orderData, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && paymentStep === 'qr') {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, paymentStep]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshQr = () => {
    setQrKey(prev => prev + 1);
    setTimeLeft(600);
  };

  const handleIHavePaid = () => {
    setPaymentStep('verifying');
  };

  const amount = orderData?.total || cartTotal;
  const orderId = orderData?.orderId || `TSC-${Math.floor(Math.random() * 1000000)}`;
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;

  const handleAppSelect = (app: typeof UPI_APPS[0]) => {
    setSelectedApp(app);
  };

  const handlePayNow = () => {
    if (!selectedApp) return;
    setPaymentStep('redirecting');
    
    // Redirect to UPI app
    setTimeout(() => {
      window.location.href = upiUrl;
      
      // After a short delay, move to verification step assuming they return
      setTimeout(() => {
        setPaymentStep('verifying');
      }, 3000);
    }, 1500);
  };

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/[^0-9]/.test(value)) {
      return;
    }
    setUtrNumber(value);
    
    if (value.length > 0 && value.length < 12) {
      setUtrError('UTR must be exactly 12 digits');
    } else {
      setUtrError('');
    }
  };

  const handleConfirmPayment = async () => {
    if (utrNumber.length !== 12) {
      setUtrError('Please enter a valid 12-digit UTR');
      return;
    }
    
    setIsProcessing(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Play success sound
    const audio = new Audio(ORDER_SUCCESS_SOUND);
    audio.play().catch(err => console.log('Audio playback failed:', err));

    clearCart();
    setIsProcessing(false);
    
    // Pass UTR and payment status to success page
    const finalOrderData = {
      ...orderData,
      paymentMethod: selectedApp ? selectedApp.name : 'UPI QR',
      paymentStatus: 'pending_verification',
      utrNumber: utrNumber
    };
    
    navigate('/success', { state: { orderData: finalOrderData } });
  };

  if (!orderData) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-xl mx-auto px-4 md:px-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-green text-white rounded-full flex items-center justify-center font-bold shadow-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-tea-green mt-2 uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex-grow h-1 bg-tea-green mx-4 -mt-6" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-brown text-tea-cream rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
            <span className="text-xs font-bold text-tea-brown mt-2 uppercase tracking-widest">Payment</span>
          </div>
          <div className="flex-grow h-1 bg-tea-brown/10 mx-4 -mt-6" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-cream text-tea-brown/20 rounded-full flex items-center justify-center font-bold border-2 border-tea-brown/5">3</div>
            <span className="text-xs font-bold text-tea-brown/20 mt-2 uppercase tracking-widest">Success</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-tea-brown hover:text-tea-gold transition-colors mb-6 font-bold text-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-tea-brown/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-tea-gold" />
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-tea-brown mb-2">Complete Payment</h2>
            <p className="text-tea-brown/60 text-sm">Order ID: <span className="font-bold text-tea-brown">{orderId}</span></p>
          </div>

          <AnimatePresence mode="wait">
            {paymentStep === 'select' && (
              <motion.div
                key="select-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="bg-tea-cream/30 p-6 rounded-3xl border-2 border-tea-brown/5 mb-6 w-full text-center">
                  <p className="text-tea-brown/60 text-sm font-bold uppercase tracking-widest mb-1">Amount to Pay</p>
                  <p className="text-4xl font-bold text-tea-brown">₹{amount}</p>
                </div>

                <h3 className="text-lg font-bold text-tea-brown mb-4 w-full text-left">Select UPI App</h3>
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleAppSelect(app)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedApp?.id === app.id ? 'border-tea-gold bg-tea-gold/5 shadow-md' : 'border-tea-brown/5 hover:border-tea-gold/30 bg-white'}`}
                    >
                      <img src={app.icon} alt={app.name} className="w-10 h-10 mb-3 object-contain" />
                      <span className="font-bold text-tea-brown text-sm">{app.name}</span>
                    </button>
                  ))}
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={handlePayNow}
                    disabled={!selectedApp}
                    className="w-full bg-tea-brown text-tea-cream py-4 rounded-xl font-bold text-base hover:bg-tea-gold transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pay Now
                  </button>
                  <button 
                    onClick={() => setPaymentStep('qr')}
                    className="w-full bg-transparent text-tea-brown py-4 rounded-xl font-bold text-sm hover:bg-tea-cream/50 transition-all"
                  >
                    Show QR Code Instead
                  </button>
                </div>
              </motion.div>
            )}

            {paymentStep === 'redirecting' && (
              <motion.div
                key="redirecting-section"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="w-20 h-20 bg-tea-cream rounded-full flex items-center justify-center mb-6 relative">
                  <Loader2 size={32} className="text-tea-gold animate-spin absolute" />
                  {selectedApp && <img src={selectedApp.icon} alt={selectedApp.name} className="w-10 h-10 object-contain z-10" />}
                </div>
                <h3 className="text-2xl font-serif font-bold text-tea-brown mb-2">Redirecting...</h3>
                <p className="text-tea-brown/60 text-center text-sm">
                  Opening {selectedApp?.name} to complete your payment.
                </p>
              </motion.div>
            )}

            {paymentStep === 'qr' && (
              <motion.div
                key="qr-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="bg-tea-cream/30 p-6 rounded-3xl border-2 border-tea-brown/5 mb-6 w-full text-center">
                  <p className="text-tea-brown/60 text-sm font-bold uppercase tracking-widest mb-1">Amount to Pay</p>
                  <p className="text-4xl font-bold text-tea-brown">₹{amount}</p>
                </div>

                {amount > 0 ? (
                  <div className="relative mb-6">
                    <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-tea-cream">
                      <QRCodeSVG 
                        key={qrKey}
                        value={upiUrl} 
                        size={220}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                          src: "https://cdn-icons-png.flaticon.com/512/6124/6124997.png", // Generic UPI icon
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                    </div>
                    {timeLeft === 0 && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                        <p className="text-red-500 font-bold mb-2">QR Code Expired</p>
                        <button 
                          onClick={handleRefreshQr}
                          className="flex items-center bg-tea-brown text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-tea-gold transition-colors"
                        >
                          <RefreshCw size={16} className="mr-2" /> Refresh QR
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-center w-full font-bold text-sm">
                    Invalid amount. Please try again.
                  </div>
                )}

                <div className="flex items-center justify-center space-x-2 text-tea-brown/60 mb-6 font-medium text-sm">
                  <QrCode size={18} />
                  <span>Scan this QR using any UPI app</span>
                </div>

                <div className="w-full bg-tea-cream/20 border border-tea-brown/10 rounded-2xl p-4 flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <Smartphone size={20} className="text-tea-brown/40 mr-3" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-tea-brown/40">UPI ID</p>
                      <p className="font-bold text-tea-brown text-sm">{UPI_ID}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCopyUpi}
                    className="p-2 bg-white rounded-xl shadow-sm border border-tea-brown/5 hover:bg-tea-cream transition-colors text-tea-brown"
                    title="Copy UPI ID"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-tea-green" /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="w-full flex items-center justify-between mb-8 text-sm font-bold">
                  <span className="text-tea-brown/60">QR valid for:</span>
                  <span className={`${timeLeft < 60 ? 'text-red-500' : 'text-tea-gold'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={handleIHavePaid}
                    className="w-full bg-tea-brown text-tea-cream py-4 rounded-xl font-bold text-base hover:bg-tea-gold transition-all shadow-xl active:scale-95"
                  >
                    I Have Paid
                  </button>
                  {isMobile && (
                    <button 
                      onClick={() => setPaymentStep('select')}
                      className="w-full bg-transparent text-tea-brown py-4 rounded-xl font-bold text-sm hover:bg-tea-cream/50 transition-all"
                    >
                      Pay with UPI App Instead
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {paymentStep === 'verifying' && (
              <motion.div
                key="verification-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-4"
              >
                <div className="w-16 h-16 bg-tea-gold/10 text-tea-gold rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-tea-brown mb-2">Verify Payment</h3>
                <p className="text-tea-brown/60 text-center text-sm mb-8">
                  Did you complete the payment? Please enter the 12-digit UTR / Transaction ID from your UPI app to verify.
                </p>

                <div className="w-full mb-8">
                  <label className="block text-xs font-bold text-tea-brown uppercase tracking-widest mb-2">
                    UTR / Transaction ID
                  </label>
                  <input 
                    type="text" 
                    value={utrNumber}
                    onChange={handleUtrChange}
                    placeholder="e.g. 312345678901"
                    className={`w-full bg-tea-cream/30 border-2 ${utrError ? 'border-red-400' : 'border-tea-brown/10'} p-4 rounded-xl focus:border-tea-gold outline-none transition-all font-mono text-lg text-center tracking-widest`}
                    maxLength={12}
                  />
                  {utrError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 text-center">{utrError}</p>}
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={handleConfirmPayment}
                    disabled={utrNumber.length !== 12 || isProcessing}
                    className="w-full bg-tea-brown text-tea-cream py-4 rounded-xl font-bold text-base hover:bg-tea-gold transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={20} className="animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      'Confirm Payment'
                    )}
                  </button>
                  <button 
                    onClick={() => setPaymentStep(isMobile ? 'select' : 'qr')}
                    disabled={isProcessing}
                    className="w-full bg-transparent text-tea-brown py-4 rounded-xl font-bold text-sm hover:bg-tea-cream/50 transition-all disabled:opacity-50"
                  >
                    Retry Payment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-center mt-8 gap-3 text-tea-brown/30">
            <ShieldCheck size={16} className="text-tea-green" />
            <span className="text-[10px] font-bold uppercase tracking-widest">100% Secure Transaction</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
