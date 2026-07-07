'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Share2 } from 'lucide-react';
import { CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/gym56-logo.png"
                alt="GYM 56 - Forged Strength"
                width={100}
                height={100}
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Premium fitness experience in Gandhinagar. Transform your body and mind with our expert trainers and modern facilities.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/gym56_gandhinagar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-[#DC2626] hover:border-[#DC2626] transition-all"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://jsdl.in/DT-99GFBNQ1Y5B"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-[#DC2626] hover:border-[#DC2626] transition-all"
                aria-label="Justdial"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="https://maps.app.goo.gl/Y4VNHVrCJjX1HCUx6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-[#DC2626] hover:border-[#DC2626] transition-all"
                aria-label="Google Maps"
              >
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/equipment" className="text-gray-400 hover:text-white transition-colors">Equipment</Link></li>
              <li><Link href="/exercises" className="text-gray-400 hover:text-white transition-colors">Exercises</Link></li>
              <li><Link href="/nutrition" className="text-gray-400 hover:text-white transition-colors">Nutrition</Link></li>
              <li><Link href="/tools" className="text-gray-400 hover:text-white transition-colors">Tools</Link></li>
              <li><Link href="/ai-coach" className="text-gray-400 hover:text-white transition-colors">AI Coach</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>2nd Floor, Yogi Mall, Behind D-Mart, Green City, Sector 26, Gandhinagar, Gujarat 382028</li>
              <li>
                <a href="tel:+91992441179" className="hover:text-white transition-colors">+91 99244 41179</a>
              </li>
              <li>
                <a
                  href={CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +91 94294 21772
                </a>
              </li>
              <li>Mon - Sat: 6:00 - 10:00 AM & 5:00 - 10:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Follow Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/gym56_gandhinagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/Y4VNHVrCJjX1HCUx6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Google Maps
                </a>
              </li>
              <li>
                <a
                  href="https://jsdl.in/DT-99GFBNQ1Y5B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Justdial
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Gym 56. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
