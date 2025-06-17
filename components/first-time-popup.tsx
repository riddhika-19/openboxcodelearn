"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { User, Mail, Phone, Heart, Loader2, CheckCircle, Users, X, Sparkles, Zap, Target } from "lucide-react"
import Image from "next/image"

interface FirstTimePopupProps {
  isOpen: boolean
  onClose: () => void
}

export function FirstTimePopup({ isOpen, onClose }: FirstTimePopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [registrationResult, setRegistrationResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          personalityType: "motivated",
          learningGoals: "Learn C++ programming and get placement ready",
          experience: "beginner",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setRegistrationResult(result)
        setIsSuccess(true)
        localStorage.setItem("openbox-user", JSON.stringify(result.userData))
        localStorage.setItem("openbox-first-visit", "false")

        // Auto-close after showing success for 5 seconds
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 5000)
      } else {
        alert(result.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkip = () => {
    localStorage.setItem("openbox-first-visit", "false")
    onClose()
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Success State
  if (isSuccess) {
    const welcomeEmailSent = registrationResult?.debug?.welcomeEmailSent
    const contactCreated = registrationResult?.debug?.contactCreated

    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl" hideCloseButton>
          <div className="text-center py-8">
            {/* Animated Success Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-4">
              <div className="text-4xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to OpenBox!
              </h2>
              <p className="text-gray-600 text-lg">You're now part of our amazing community of 15,000+ C++ learners!</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 my-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                What's Coming Your Way
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-blue-800">
                  <Mail className="w-4 h-4" />
                  <span>Daily emails</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Target className="w-4 h-4" />
                  <span>Personal goals</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Users className="w-4 h-4" />
                  <span>Community access</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Zap className="w-4 h-4" />
                  <span>AI assistance</span>
                </div>
              </div>
            </div>

            {/* Email Status */}
            <div
              className={`border rounded-lg p-4 mb-6 ${
                welcomeEmailSent ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p className={`text-sm font-medium ${welcomeEmailSent ? "text-green-800" : "text-yellow-800"}`}>
                {welcomeEmailSent
                  ? `📧 Welcome email sent to ${formData.email}! Check your inbox.`
                  : "📧 Welcome email is being processed. You'll receive it shortly."}
              </p>
            </div>

            {/* Community Status */}
            <div
              className={`border rounded-lg p-4 mb-6 ${
                contactCreated ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className={`text-sm font-medium ${contactCreated ? "text-blue-800" : "text-gray-800"}`}>
                {contactCreated
                  ? "👥 Added to community mailing list successfully!"
                  : "👥 Adding you to our community list..."}
              </p>
            </div>

            <div className="text-sm text-gray-500 animate-pulse">Starting your C++ journey in 5 seconds...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[550px] border-0 shadow-2xl overflow-hidden" hideCloseButton>
        {/* Custom Close Button */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 -m-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/images/openbox-logo.png"
                alt="OpenBox Community"
                width={120}
                height={30}
                className="h-7 w-auto brightness-0 invert"
              />
              <Badge variant="outline" className="border-white text-white text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Open Source
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Welcome to OpenBox! 👋</h1>
              <p className="text-blue-100">Join 15,000+ developers mastering C++ with personalized learning</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? "bg-white" : "bg-white/30"}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? "bg-white" : "bg-white/30"}`} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Welcome & Benefits */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Start Your C++ Mastery Journey!</h2>
                <p className="text-gray-600">Get personalized daily emails and join our amazing community</p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900 text-sm">Daily Emails</h3>
                    <p className="text-xs text-blue-700">Personalized progress updates</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-900 text-sm">Community</h3>
                    <p className="text-xs text-purple-700">15,000+ active learners</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900 text-sm">AI Powered</h3>
                    <p className="text-xs text-green-700">Smart learning assistance</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-orange-900 text-sm">100% Free</h3>
                    <p className="text-xs text-orange-700">Open source forever</p>
                  </CardContent>
                </Card>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">15K+</div>
                    <div className="text-xs text-gray-600">Learners</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-xs text-gray-600">Contributors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div class="text-xs text-gray-600">Free</div>
                  </div>
                </div>
              </div>

              <Button onClick={nextStep} className="w-full h-12 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started - It's Free!
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                className="w-full text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </Button>
            </div>
          )}

          {/* Step 2: Form */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📝</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Just 3 Quick Details</h2>
                <p className="text-gray-600 text-sm">We'll send you a welcome email immediately after registration</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2 font-medium">
                    <User className="w-4 h-4 text-blue-600" />
                    What's your name? *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-12 border-2 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2 font-medium">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email for welcome message *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="h-12 border-2 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2 font-medium">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Phone number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="h-12 border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email Promise */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900 mb-1">Instant Welcome Email</p>
                    <p className="text-green-700">
                      You'll receive a personalized welcome email immediately after clicking "Join OpenBox!" Check your
                      inbox for next steps and learning resources.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                  Back
                </Button>
                <Button type="submit" className="flex-1 h-12" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Joining & Sending Email...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Join OpenBox!
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By joining, you agree to receive personalized learning emails.
                <br />
                <strong>100% free forever • Open source • No spam</strong>
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FirstTimePopup
