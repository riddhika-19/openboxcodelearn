"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Heart, Loader2, CheckCircle, Users, Gift, Brain, Target } from "lucide-react"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// Keep the original RegistrationModal for manual registration
export function RegistrationModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    learningGoals: "",
    personalityType: "motivated",
    weeklyGoal: "Complete 3 lessons per week",
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
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        // Store user data locally
        localStorage.setItem("openbox-user", JSON.stringify(result.userData))

        // Schedule daily progress emails (in a real app, this would be handled by a cron job)
        scheduleProgressEmails(formData)
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

  const scheduleProgressEmails = (userData: typeof formData) => {
    // In a real application, this would be handled by a backend cron job
    // For demo purposes, we'll simulate scheduling
    console.log("Progress emails scheduled for:", userData.email)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to OpenBox! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Registration successful! Check your email for a personalized welcome message and your learning roadmap.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>📧 Daily personalized progress emails</li>
                <li>🎯 Customized learning recommendations</li>
                <li>👥 Access to our Discord community</li>
                <li>🏆 Weekly challenges and achievements</li>
              </ul>
            </div>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Start Learning Journey
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Image
              src="/images/openbox-logo.png"
              alt="OpenBox Community"
              width={80}
              height={20}
              className="h-5 w-auto"
            />
            <Badge variant="outline" className="text-xs">
              <Heart className="w-3 h-3 mr-1 text-red-500" />
              Open Source
            </Badge>
          </div>
          <DialogTitle className="text-2xl">Join the OpenBox Community! 🚀</DialogTitle>
          <DialogDescription>
            Start your personalized C++ learning journey with AI-powered progress tracking and daily motivation emails.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Learning Profile */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Learning Profile
              </CardTitle>
              <CardDescription>Help us personalize your learning experience and daily emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Programming Experience Level</Label>
                <RadioGroup
                  value={formData.experience}
                  onValueChange={(value) => handleInputChange("experience", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">🌱 Complete Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some-experience" id="some-experience" />
                    <Label htmlFor="some-experience">📚 Some Programming Experience</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experienced" id="experienced" />
                    <Label htmlFor="experienced">💻 Experienced in Other Languages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cpp-beginner" id="cpp-beginner" />
                    <Label htmlFor="cpp-beginner">🔧 New to C++ Specifically</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Email Personality Type</Label>
                <RadioGroup
                  value={formData.personalityType}
                  onValueChange={(value) => handleInputChange("personalityType", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="motivated" id="motivated" />
                    <Label htmlFor="motivated">🚀 High-energy and motivational</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="encouraging" id="encouraging" />
                    <Label htmlFor="encouraging">🌟 Gentle and encouraging</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analytical" id="analytical" />
                    <Label htmlFor="analytical">📊 Data-driven and analytical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="competitive" id="competitive" />
                    <Label htmlFor="competitive">🏆 Competitive and challenge-focused</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="learningGoals">Learning Goals & Motivation</Label>
                <Textarea
                  id="learningGoals"
                  value={formData.learningGoals}
                  onChange={(e) => handleInputChange("learningGoals", e.target.value)}
                  placeholder="What do you want to achieve with C++? (e.g., get a job, build projects, competitive programming, etc.)"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Community Benefits */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                What You'll Get
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Daily personalized progress emails</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Customized learning recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Access to Discord community</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span>AI-powered learning insights</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Account...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Join OpenBox Community
              </>
            )}
          </Button>

          <p className="text-xs text-gray-600 text-center">
            By joining, you agree to receive personalized learning emails and become part of our open-source community.
            You can unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
