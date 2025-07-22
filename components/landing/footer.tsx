"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  Banking: [
    { name: "Checking Accounts", href: "#" },
    { name: "Savings Accounts", href: "#" },
    { name: "Credit Cards", href: "#" },
    { name: "Loans", href: "#" },
    { name: "Mortgages", href: "#" },
  ],
  "Digital Services": [
    { name: "Mobile Banking", href: "#" },
    { name: "Online Banking", href: "#" },
    { name: "Bill Pay", href: "#" },
    { name: "Mobile Deposit", href: "#" },
    { name: "Wire Transfers", href: "#" },
  ],
  Security: [
    { name: "Selfie Verification", href: "#" },
    { name: "Device Management", href: "#" },
    { name: "Fraud Protection", href: "#" },
    { name: "Security Center", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
  Support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Branch Locator", href: "#" },
    { name: "Customer Service", href: "#" },
    { name: "Feedback", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">PPB</span>
              </div>
              <span className="text-xl font-bold">WallmountAllied</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Experience the future of banking with advanced security, intelligent features, and seamless digital
              experiences designed for modern life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <div className="font-medium">Customer Service</div>
                <div className="text-gray-400">1-800-PPB-BANK</div>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <div className="font-medium">Email Support</div>
                <div className="text-gray-400">support@WallmountAllied.com</div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <div className="font-medium">Headquarters</div>
                <div className="text-gray-400">New York, NY</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 WallmountAllied. All rights reserved. Member FDIC. Equal Housing Lender.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
