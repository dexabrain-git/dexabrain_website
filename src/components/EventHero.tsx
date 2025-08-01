'use client';

import CalendarButton from './CalendarButton';

export default function EventHero() {
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
      {/* ZenEasy-style Glow Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amberGlow rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradientStart rounded-full opacity-30 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradientEnd rounded-full opacity-25 blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 border border-white border-opacity-30">
                FREE SEMINAR
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase tracking-wide">
                Neuro Reset Awareness Seminar
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8 font-light">
                Prof Andy Hsu & Dr Diana Chan introduce holistic, neuroscience-backed chronic pain management.
              </p>
            </div>

            {/* Event Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold">SEPT 7</div>
                <div className="text-blue-100 text-sm font-light">2025</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold">3:00 PM</div>
                <div className="text-blue-100 text-sm font-light">START TIME</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold">50</div>
                <div className="text-blue-100 text-sm font-light">SEATS LEFT</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all duration-300 text-lg shadow-card hover:shadow-lg transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                REGISTER NOW
              </a>
              
              <CalendarButton 
                variant="secondary"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all duration-300 text-lg backdrop-blur-sm hover:shadow-glow"
              />
            </div>
          </div>

          {/* Banner Image */}
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 shadow-card">
              <div className="aspect-video bg-gradient-primary rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* ZenEasy-style lighting effect */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-amberGlow rounded-full opacity-60 blur-sm animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradientStart rounded-full opacity-50 blur-sm animate-pulse delay-700"></div>
                
                <div className="text-center relative z-10">
                  <svg className="w-24 h-24 text-white opacity-80 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white text-lg font-medium">Event Banner</p>
                  <p className="text-blue-100 text-sm font-light">Placeholder for banner image</p>
                </div>
              </div>
              
              {/* Venue Info */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-blue-100 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">West Forum, Trehaus</span>
                </div>
                <p className="text-blue-200 text-sm font-light">Funan L3, City Hall</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 