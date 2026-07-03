"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gym56-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("gym56-cookie-consent", "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  }

  function decline() {
    localStorage.setItem("gym56-cookie-consent", "declined");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[200] max-w-md mx-auto md:mx-0"
        >
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white mb-1">Cookie Consent</h3>
                <p className="text-sm text-gray-400 mb-4">
                  We use cookies to enhance your experience and analyze site traffic. By accepting, you consent to our use of cookies.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={accept}
                    className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold rounded-full transition-all duration-300"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={decline}
                    className="px-4 py-2 border border-white/20 text-gray-300 text-sm font-semibold rounded-full hover:border-white/40 transition-all duration-300"
                  >
                    Essential Only
                  </button>
                </div>
              </div>
              <button
                onClick={decline}
                aria-label="Close cookie consent"
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
