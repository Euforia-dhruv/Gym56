"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-32 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-[#DC2626]">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions? We would love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <div className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-[#DC2626]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Location</h3>
                  <p className="text-gray-400 mb-4">
                    2nd Floor, Yogi Mall,<br/>
                    Behind D-Mart, Green City,<br/>
                    Sector 26, Gandhinagar,<br/>
                    Gujarat 382028
                  </p>
                  <a
                    href="https://maps.app.goo.gl/fC3iHyTbnKSci16t5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] rounded-full text-sm font-medium hover:bg-[#DC2626]/20 transition-colors inline-block"
                  >
                    Get Directions
                  </a>
                  <a
                    href="https://www.instagram.com/gym56_gandhinagar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 text-purple-400 rounded-full text-sm font-medium hover:bg-purple-500/20 transition-colors inline-flex items-center gap-2 ml-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    Instagram
                  </a>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-[#DC2626]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Phone</h3>
                  <p className="text-gray-400">+91 99244 41179</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-[#DC2626]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Follow Us</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <a
                      href="https://www.instagram.com/gym56_gandhinagar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 text-purple-400 rounded-full text-sm font-medium hover:bg-purple-500/20 transition-colors inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>

                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#DC2626]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Business Hours</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { day: "Monday", hours: "6–10 AM, 5–10 PM" },
                    { day: "Tuesday", hours: "6–10 AM, 5–10 PM" },
                    { day: "Wednesday", hours: "6–10 AM, 5–10 PM" },
                    { day: "Thursday", hours: "6–10 AM, 5–10 PM" },
                    { day: "Friday", hours: "6–10 AM, 5–10 PM" },
                    { day: "Saturday", hours: "6–10 AM, 5–10 PM" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((schedule, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0">
                      <span className="text-gray-300 font-medium">{schedule.day}</span>
                      <span className={`text-sm ${schedule.hours === "Closed" ? "text-red-400" : "text-gray-400"}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Message sent successfully! We will get back to you soon.</span>
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Something went wrong. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border transition-all focus:outline-none focus:ring-1 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-2 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border transition-all focus:outline-none focus:ring-1 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-black/50 border transition-all focus:outline-none focus:ring-1 ${
                    errors.subject
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]"
                  }`}
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <p role="alert" className="mt-2 text-sm text-red-400">{errors.subject}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-black/50 border transition-all focus:outline-none focus:ring-1 resize-none ${
                    errors.message
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]"
                  }`}
                  placeholder="Tell us more..."
                ></textarea>
                {errors.message && (
                  <p role="alert" className="mt-2 text-sm text-red-400">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
