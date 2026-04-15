'use client';

import Link from 'next/link';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ClockIcon, 
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  StarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const stats = [
    { label: 'Active Tutors', value: '500+', icon: AcademicCapIcon },
    { label: 'Happy Students', value: '10,000+', icon: UserGroupIcon },
    { label: 'Hours Taught', value: '50,000+', icon: ClockIcon },
    { label: 'Subjects', value: '100+', icon: BookOpenIcon },
  ];

  const features = [
    {
      title: 'Expert Tutors',
      description: 'All our tutors are verified professionals with years of teaching experience.',
      icon: AcademicCapIcon,
    },
    {
      title: 'Personalized Learning',
      description: 'Get customized lesson plans tailored to your learning style and goals.',
      icon: UserGroupIcon,
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book sessions at times that work best for you, 24/7 availability.',
      icon: ClockIcon,
    },
    {
      title: 'Global Community',
      description: 'Connect with learners and tutors from around the world.',
      icon: GlobeAltIcon,
    },
    {
      title: 'Interactive Sessions',
      description: 'Engage in live, interactive learning sessions with real-time feedback.',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: 'Secure Platform',
      description: 'Your data and payments are protected with enterprise-grade security.',
      icon: ShieldCheckIcon,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      content: 'SkillBridge helped me find the perfect math tutor. My grades improved significantly!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Tutor',
      content: 'Teaching on SkillBridge has been amazing. The platform is easy to use and the students are great.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student',
      content: 'The flexible scheduling allowed me to learn programming while working full-time.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About SkillBridge
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              We're on a mission to make quality education accessible to everyone, 
              connecting passionate learners with expert tutors worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
                    <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillBridge was founded in 2024 with a simple yet powerful vision: 
              to create a platform where anyone can learn anything from expert tutors, 
              regardless of their location or schedule.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              What started as a small community of passionate educators has grown 
              into a global network of over 500 expert tutors and 10,000+ satisfied students.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Today, we continue to innovate and improve, adding new features and 
              subjects to serve our growing community better.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-8 text-center">
            <AcademicCapIcon className="h-24 w-24 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">- Nelson Mandela</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide everything you need for a successful learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
                    <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What People Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Don't just take our word for it
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and tutors already using SkillBridge
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/tutors"
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Find a Tutor
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Become a Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}