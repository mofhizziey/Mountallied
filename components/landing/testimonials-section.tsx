"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The selfie verification is a game-changer! No more fumbling with passwords. I can access my account securely in seconds, even when I'm on the go managing my business.",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "As someone in tech, I appreciate the advanced security features. The device management gives me complete control over my account access, and the real-time alerts are incredibly helpful.",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The smart analytics feature has completely changed how I manage my finances. The AI insights help me understand my spending patterns and save more effectively.",
  },
  {
    name: "David Thompson",
    role: "Freelance Designer",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Virtual cards for online purchases are brilliant! I can create a new card for each client project and set spending limits. It's made my freelance finances so much easier to manage.",
  },
  {
    name: "Lisa Park",
    role: "Healthcare Professional",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The mobile app is incredibly intuitive. Between my busy schedule at the hospital, I need banking that just works. WallmountAllied delivers exactly that.",
  },
  {
    name: "James Wilson",
    role: "Retired Teacher",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "I was hesitant about digital banking, but the customer support team made the transition seamless. The security features give me peace of mind about my retirement savings.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands of Customers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers are saying about their experience with WallmountAllied's innovative features and
            exceptional service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 text-gray-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
