import React from 'react';
import { HelpCircle, MessageCircle, FileText, Phone, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

const Support = () => {
  const faqs = [
    { q: "How is the viral score calculated?", a: "Our proprietary algorithm uses a weighted formula: (likes * 0.4) + (retweets * 0.4) + (replies * 0.2), combined with social velocity." },
    { q: "Can I export my sentiment analysis data?", a: "Yes, Pro users can export all data in CSV or JSON format via the Settings panel." },
    { q: "How real-time is the intelligence feed?", a: "The dashboard syncs with our backend every 30 seconds for live viral tracking." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 px-1 sm:px-0">
      <div className="text-center space-y-3 md:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">Support Intelligence</h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto">
          Need help navigating the TweetVerse? Our team and AI documentation are here to guide you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: MessageCircle, title: 'Live Chat', desc: 'Average response: 2 mins', color: 'text-twitter', bg: 'bg-twitter/5' },
          { icon: FileText, title: 'API Docs', desc: 'Full technical reference', color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: Phone, title: 'Direct Line', desc: '+1 (800) TWEET-AI', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer text-center">
            <div className={`w-16 h-16 mx-auto rounded-3xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-twitter" /> Frequently Asked
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-twitter/30 transition-all cursor-default group">
                <h4 className="font-black text-slate-800 text-sm mb-2 group-hover:text-twitter transition-colors">{faq.q}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Simulation */}
        <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-twitter/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h2 className="text-2xl font-black text-white mb-6">Send a Message</h2>
            <form className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-twitter/50" />
                    <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-twitter/50" />
                </div>
                <textarea rows="4" placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-twitter/50 resize-none"></textarea>
                <button className="w-full bg-twitter text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-twitter/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    Submit Inquiry <ArrowRight className="w-4 h-4" />
                </button>
            </form>
            <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Encryption</div>
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-twitter" /> 24/7 Global Support</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
