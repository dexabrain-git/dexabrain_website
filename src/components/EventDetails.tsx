'use client';

export default function EventDetails() {
  const speakers = [
    {
      name: 'Prof Andy Hsu',
      title: 'Neuroscience Specialist',
      bio: 'Leading expert in neuroscience-backed pain management with over 15 years of clinical experience.',
      image: '/assets/speaker1.jpg'
    },
    {
      name: 'Dr Diana Chan',
      title: 'Holistic Health Practitioner',
      bio: 'Specialist in integrative approaches to chronic pain management and wellness optimization.',
      image: '/assets/speaker2.jpg'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4 uppercase tracking-wide">
            Event Details
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Join us for an enlightening seminar on holistic, neuroscience-backed chronic pain management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Event Information */}
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-dark mb-6 uppercase tracking-wide">
              Seminar Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-dark">Date & Time</h4>
                  <p className="text-gray-600 font-light">September 7, 2025 • 3:00 PM - 4:30 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-dark">Venue</h4>
                  <p className="text-gray-600 font-light">West Forum, Trehaus<br />Funan L3, City Hall</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-dark">Duration</h4>
                  <p className="text-gray-600 font-light">90 minutes (including Q&A session)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-dark">Capacity</h4>
                  <p className="text-gray-600 font-light">Limited to 50 participants</p>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-dark mb-6 uppercase tracking-wide">
              What You&apos;ll Learn
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 font-light">Understanding the neuroscience behind chronic pain</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 font-light">Holistic approaches to pain management</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 font-light">Practical techniques for daily pain relief</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 font-light">Q&A session with leading experts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Speakers */}
        <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-dark mb-8 text-center uppercase tracking-wide">
            Meet Our Speakers
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {speakers.map((speaker, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8c0 2.208-1.79 4-3.998 4-2.208 0-3.998-1.792-3.998-4s1.79-4 3.998-4c2.208 0 3.998 1.792 3.998 4z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-dark">{speaker.name}</h4>
                  <p className="text-primary font-medium mb-2">{speaker.title}</p>
                  <p className="text-gray-600 font-light">{speaker.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 