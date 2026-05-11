"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Linkedin, Github, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
    { label: "Membership", href: "/membership" },
  ];

  const chapters = [
    { label: "IEEE RAS", href: "/chapters/ras" },
    { label: "Computer Society", href: "/chapters/code-club" },
    { label: "IEEE WIE", href: "/about#wie" },
    { label: "IEEE COMSOC", href: "/events#comsic" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "httpas://www.linkedin.com/company/ieeergipt", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="relative w-full bg-black border-t border-white/10 mt-20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                IEEE
              </h3>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                Student Branch
              </p>
              <p className="text-xs sm:text-sm text-white/50 mt-2">
                Rajiv Gandhi Institute of Petroleum Technology
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                const isFacebook = social.label === "Facebook";
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:text-white transition-colors" />
                    </a>
                    {isFacebook && (
                      <Link
                        href="/creator"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm font-semibold animate-pulse hover:animate-none hover:from-purple-500 hover:to-blue-500 transition-all inline-block"
                      >
                        Created by
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-white/60 hover:text-white transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chapters */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Chapters
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {chapters.map((chapter) => (
                <li key={chapter.href}>
                  <Link
                    href={chapter.href}
                    className="text-sm sm:text-base text-white/60 hover:text-white transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {chapter.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Contact Us
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:ieee_sb@rgipt.ac.in"
                  className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors break-all"
                >
                  ieee_sb@rgipt.ac.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+917870304944"
                  className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                >
                  +91 7870304944
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/917870304944"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  RGIPT, Jais, Amethi, UP, India
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 mt-8 sm:mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-xs sm:text-sm text-white/50 text-center sm:text-left">
              © {currentYear} IEEE Student Branch RGIPT. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/50">
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-[10px] sm:text-xs text-white/40">
              Powered by IEEE RGIPT Student Branch
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


