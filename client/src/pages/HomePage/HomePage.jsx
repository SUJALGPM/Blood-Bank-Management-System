import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function HomePage() {
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDonationCount((prevCount) => (prevCount + 1) % 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header/>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-600 h-[90vh] flex items-center to-pink-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-pulse">
              Be a Lifesaver
            </h1>
            <p className="text-xl mb-8">
              Your donation can spark hope and heal lives.
            </p>
            <a
              href="#"
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-400 transition duration-300 transform hover:scale-105 inline-block animate-bounce"
            >
              Donate Now
            </a>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-700">
              Why Your Donation Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                }
                title="Save Lives"
                description="Your donation can save up to 3 lives with a single pint of blood."
              />
              <FeatureCard
                icon={""}
                title="Community Impact"
                description="Join a network of heroes making a difference in your community."
              />
              <FeatureCard
                icon={""}
                title="Quick & Easy"
                description="The donation process is quick, easy, and can fit into your busy schedule."
              />
              <FeatureCard
                icon={""}
                title="Nearby Centers"
                description="Find convenient donation locations near you with our center locator."
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-orange-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-purple-700">
              Blood Donations This Month
            </h2>
            <div className="text-6xl font-bold text-orange-500 mb-4">
              {donationCount}
            </div>
            <p className="text-xl text-gray-700">
              Every drop counts. Join our community of lifesavers today!
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-700">
              What Our Donors Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Donating blood made me feel like a real-life superhero. It's an easy way to make a big impact!"
                author="Sarah J."
              />
              <TestimonialCard
                quote="The staff was so friendly and made the process comfortable. I'll definitely be donating again!"
                author="Mike T."
              />
              <TestimonialCard
                quote="Knowing my donation could save lives gives me an incredible sense of purpose. Everyone should try it!"
                author="Emily R."
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Be a Hero?</h2>
            <p className="text-xl mb-8">
              Join our community of lifesavers and make a difference today.
            </p>
            <a
              href="#"
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-400 transition duration-300 transform hover:scale-105 inline-block animate-bounce"
            >
              Register as a Donor
            </a>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
      <div className="flex justify-center mb-4">
        <svg
          className="w-12 h-12 text-orange-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-purple-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{quote}"</p>
      <p className="font-semibold text-purple-700">- {author}</p>
    </div>
  );
}
