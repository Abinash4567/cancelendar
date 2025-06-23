'use client'

import React from 'react';
import Link from "next/link";
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Home = () => {
  const { data: session } = useSession();

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-400" />,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that adapts to your preferences and availability."
    },
    {
      icon: <Clock className="h-6 w-6 text-green-400" />,
      title: "Time Blocking",
      description: "Organize your day with intelligent time blocks and productivity insights."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Team Collaboration",
      description: "Seamlessly coordinate with team members and share calendars effortlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">CalendarPro</span>
            </div>

            <div className="flex items-center space-x-4">
              {session ? (
                <Avatar>
                  <AvatarImage
                    src={session.user?.image || undefined}
                    alt={session.user?.name || "User avatar"}
                  />
                  <AvatarFallback>
                    {session.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : ""}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Link href="/api/auth/signin">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                </Link>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300 mb-8">
            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
            Trusted by 10,000+ professionals
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
            Your Calendar,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the future of time management with AI-powered scheduling,
            seamless collaboration, and intelligent insights that adapt to your workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              Start Free Trial
            </button>
            <button className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-gray-900">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to
              <span> stay organized</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you manage your time more effectively and collaborate seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all hover:transform hover:scale-105"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              productivity?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already revolutionized their time management.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">CalendarPro</span>
          </div>
          <p>&copy; 2025 CalendarPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
