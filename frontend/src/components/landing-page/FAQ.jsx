import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Terminal } from 'lucide-react';

const faqs = [
  {
    question: "How does the SOS Emergency feature work?",
    answer: "Pressing the SOS button instantly broadcasts your geolocation to the NeXora command center and nearby responders. The AI automatically classifies it as maximum priority, bypassing standard queues to dispatch immediate help."
  },
  {
    question: "Can I report everyday civic issues like potholes?",
    answer: "Yes. The Citizen Dashboard allows you to report non-emergency issues. The AI processes these reports, categorizes them by severity, and routes them to the appropriate municipal department for resolution."
  },
  {
    question: "Is my personal data secure on the platform?",
    answer: "NeXora employs military-grade encryption for all data transmissions. Personal identifying information is compartmentalized and only accessible to authorized responders during an active emergency involving you."
  },
  {
    question: "How do NGOs integrate with the NeXora system?",
    answer: "NGOs have a dedicated dashboard to register their available resources (food, medical supplies, volunteers). When the AI detects a shortage in a disaster zone, it automatically pings relevant NGOs to deploy those specific resources."
  },
  {
    question: "How can I contribute as a volunteer?",
    answer: "Once registered as a volunteer, you can browse nearby missions, join active response teams, and collaborate with NGOs to provide ground-level support during emergencies and civic tasks."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-16 bg-[var(--bg-light)] transition-colors duration-1000 relative border-t border-primary-500/10">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            className="flex items-center gap-2 mb-4 opacity-70"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
          >
            <Terminal className="w-4 h-4 text-primary-400" />
            <h3 className="font-data text-primary-500 text-xs tracking-widest uppercase">
              QUERY DATABASE
            </h3>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-data tracking-widest text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            FREQUENTLY ASKED <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-500">QUESTIONS</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={index}
                className={`border ${isActive ? 'border-primary-400/50 bg-[var(--bg-light)]' : 'border-primary-500/20 bg-[var(--bg-dark)]/50'} rounded-lg overflow-hidden transition-colors`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setActiveIndex(isActive ? null : index)}
                >
                  <span className={`font-data text-sm tracking-wider ${isActive ? 'text-white' : 'text-primary-50/80'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary-500/20 text-primary-400' : 'bg-transparent text-primary-500/50'}`}>
                    {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="h-px w-full bg-gradient-to-r from-primary-500/20 to-transparent mb-4" />
                        <p className="text-primary-500/70 font-mono text-sm leading-relaxed">
                          <span className="text-primary-400 mr-2">{'>'}</span>{faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
