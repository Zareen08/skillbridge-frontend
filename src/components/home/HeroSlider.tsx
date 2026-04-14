'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  highlight: string;
  showSecondaryButton?: boolean;
}

const heroSlides: Slide[] = [
  {
    title: "Connect with Expert Tutors",
    subtitle: "Learn Anything, Anytime",
    description: "Find the perfect tutor for your learning journey. Book sessions instantly and start learning today.",
    buttonText: "Find a Tutor",
    buttonLink: "/tutors",
    gradient: "from-indigo-600 to-purple-600",
    highlight: "Expert Tutors",
    showSecondaryButton: true
  },
  {
    title: "Personalized Learning Experience",
    subtitle: "One-on-One Sessions",
    description: "Get customized lesson plans tailored to your learning style and goals. Achieve better results faster.",
    buttonText: "Get Started",
    buttonLink: "/auth/register",
    gradient: "from-blue-600 to-cyan-600",
    highlight: "Personalized",
    showSecondaryButton: false
  },
  {
    title: "Flexible Scheduling",
    subtitle: "Learn at Your Pace",
    description: "Book sessions at times that work best for you. 24/7 availability with tutors worldwide.",
    buttonText: "View Tutors",
    buttonLink: "/tutors",
    gradient: "from-emerald-600 to-teal-600",
    highlight: "Flexible",
    showSecondaryButton: false
  }
];

// Custom Arrow Components
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
      aria-label="Next slide"
    >
      <ChevronRightIcon className="h-6 w-6 text-white" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
      aria-label="Previous slide"
    >
      <ChevronLeftIcon className="h-6 w-6 text-white" />
    </button>
  );
};

export default function HeroSlider() {
  const sliderRef = useRef<Slider>(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i: number) => (
      <div className="w-2 h-2 bg-white/50 rounded-full transition-all duration-300 hover:bg-white" />
    ),
    appendDots: (dots: any) => (
      <div className="absolute bottom-6 left-0 right-0">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...sliderSettings}>
        {heroSlides.map((slide, index) => (
          <div key={index}>
            <div className={`bg-gradient-to-r ${slide.gradient} text-white`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center">
                  <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-fade-in">
                    <span className="text-sm font-medium">{slide.highlight}</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
                    {slide.title}
                    <br />
                    <span className="text-white/90">{slide.subtitle}</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                    {slide.description}
                  </p>
                  
                  <div className="flex justify-center gap-4 animate-slide-up animation-delay-400">
                    <Link
                      href={slide.buttonLink}
                      className="bg-white text-indigo-600 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 duration-200 shadow-lg"
                    >
                      {slide.buttonText}
                    </Link>
                    {slide.showSecondaryButton && (
                      <Link
                        href="/auth/register"
                        className="border-2 border-white text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition transform hover:scale-105 duration-200"
                      >
                        Become a Tutor
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}