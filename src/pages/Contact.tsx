import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const newErrors = { ...errors };
    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Name is required';
        else delete newErrors.name;
        break;
      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'subject':
        if (!value.trim()) newErrors.subject = 'Subject is required';
        else delete newErrors.subject;
        break;
      case 'message':
        if (!value.trim()) newErrors.message = 'Message is required';
        else delete newErrors.message;
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-tea-brown mb-4">
            Get in <span className="text-tea-gold italic">Touch</span>
          </h1>
          <p className="text-tea-brown/50 max-w-2xl mx-auto text-base leading-relaxed">
            Have questions about our premium tea? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center group hover:border-tea-gold/20 transition-all">
            <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tea-gold group-hover:text-white transition-all">
              <Phone size={28} className="text-tea-gold group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-tea-brown mb-2">Call Us</h3>
            <p className="text-tea-brown/40 text-[10px] mb-3 uppercase tracking-widest font-bold">24/7 Helpline</p>
            <p className="text-base font-bold text-tea-brown">+91 98765 43210</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center group hover:border-tea-gold/20 transition-all">
            <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tea-gold group-hover:text-white transition-all">
              <Mail size={28} className="text-tea-gold group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-tea-brown mb-2">Email Us</h3>
            <p className="text-tea-brown/40 text-[10px] mb-3 uppercase tracking-widest font-bold">Support Team</p>
            <p className="text-base font-bold text-tea-brown">support@thestrongcup.com</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center group hover:border-tea-gold/20 transition-all">
            <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tea-gold group-hover:text-white transition-all">
              <MapPin size={28} className="text-tea-gold group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-tea-brown mb-2">Visit Us</h3>
            <p className="text-tea-brown/40 text-[10px] mb-3 uppercase tracking-widest font-bold">Our Office</p>
            <p className="text-base font-bold text-tea-brown">Guwahati, Assam, India</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-tea-brown/5 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-tea-brown mb-10 text-center">Send us a <span className="text-tea-gold italic">Message</span></h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className={`w-full bg-tea-cream/30 border-2 ${errors.name ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`} 
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com" 
                  className={`w-full bg-tea-cream/30 border-2 ${errors.email ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`} 
                />
                {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?" 
                className={`w-full bg-tea-cream/30 border-2 ${errors.subject ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`} 
              />
              {errors.subject && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.subject}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more..." 
                rows={5} 
                className={`w-full bg-tea-cream/30 border-2 ${errors.message ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all resize-none`} 
              />
              {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.message}</p>}
            </div>
            <button 
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-xl flex items-center justify-center ${
                isSuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-tea-brown text-tea-cream hover:bg-tea-gold group'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={18} className="mr-2" />
                  Message Sent!
                </>
              ) : (
                <>
                  Send Message
                  <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
