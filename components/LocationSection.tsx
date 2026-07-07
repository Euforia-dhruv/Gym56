'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Star } from 'lucide-react';
import type { Map } from 'leaflet';

const GYM_LAT = 23.255305;
const GYM_LNG = 72.634158;

const hours = [
  { label: 'Monday - Saturday', times: '6:00 AM – 10:00 AM\n5:00 PM – 10:00 PM' },
  { label: 'Sunday', times: 'Closed', closed: true },
];

const buttons = [
  {
    href: 'https://maps.google.com/?q=GYM56+Sector+26+Gandhinagar',
    label: 'Get Directions',
    icon: (className: string) => <Navigation className={className} />,
    gradient: 'from-[#DC2626]/10 to-[#DC2626]/5',
    border: 'border-[#DC2626]/30',
    textColor: 'text-[#DC2626]',
    hoverBg: 'hover:bg-[#DC2626]/20',
  },
  {
    href: 'https://www.instagram.com/gym56_gandhinagar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    label: 'Instagram',
    icon: (className: string) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/30',
    textColor: 'text-purple-400',
    hoverBg: 'hover:bg-purple-500/20',
  },
  {
    href: 'https://jsdl.in/DT-99GFBNQ1Y5B',
    label: 'JustDial',
    icon: (className: string) => <Star className={className} />,
    gradient: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/30',
    textColor: 'text-blue-400',
    hoverBg: 'hover:bg-blue-500/20',
  },
];

export default function LocationSection() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let map: Map | null = null;
    let destroyed = false;

    (async () => {
      const L = await import('leaflet');

      if (destroyed) return;

      const icon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42" fill="none">
          <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.72 23.28 0 15 0Z" fill="#DC2626"/>
          <circle cx="15" cy="15" r="6" fill="white"/>
        </svg>`,
        className: '',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42],
      });

      map = L.map(el, {
        center: [GYM_LAT, GYM_LNG],
        zoom: 17,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([GYM_LAT, GYM_LNG], { icon })
        .addTo(map)
        .bindPopup('<b>GYM 56</b><br/>Green City, Sector 26, Gandhinagar')
        .openPopup();
    })();

    return () => {
      destroyed = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Visit <span className="text-[#DC2626]">GYM56</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Come experience the difference. We are located in the heart of Sector 26, Gandhinagar.
            </p>

            <div className="space-y-6">
              {/* Address */}
              <div className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-[#DC2626]/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Address</h3>
                  <p className="text-gray-400">
                    Green City,<br />
                    Sector 26,<br />
                    Gandhinagar,<br />
                    Gujarat
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-[#DC2626]/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <a
                    href="tel:+919924441179"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 99244 41179
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="glass rounded-2xl p-5 hover:border-[#DC2626]/30 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Working Hours</h3>
                  </div>
                </div>
                <div className="space-y-3 pl-[60px]">
                  {hours.map((item) => (
                    <div key={item.label}>
                      <p className="text-gray-300 text-sm font-medium">{item.label}</p>
                      {item.closed ? (
                        <p className="text-red-400 text-sm">Closed</p>
                      ) : (
                        item.times.split('\n').map((line, i) => (
                          <p key={i} className="text-gray-400 text-sm">{line}</p>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              {buttons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border transition-all duration-300 bg-gradient-to-r ${btn.gradient} ${btn.border} ${btn.textColor} ${btn.hoverBg} hover:scale-105`}
                >
                  {btn.icon('w-4 h-4')}
                  {btn.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex"
          >
            <div
              className="relative w-full rounded-[24px] overflow-hidden border border-[#DC2626]/30 bg-black/60 shadow-2xl shadow-[#DC2626]/10 group hover:scale-[1.02] transition-all duration-500"
            >
              <div className="absolute -inset-4 bg-[#DC2626]/5 blur-3xl rounded-[32px] opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div
                ref={mapRef}
                className="relative z-10 w-full rounded-[24px]"
                style={{ minHeight: '400px' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
