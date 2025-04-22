import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-nature-600/10 z-0"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission to Revolutionize <span className="text-nature-600">Farm-to-Table</span></h1>
                <p className="text-lg text-gray-600 mb-8">
                  At Green Bridge, we're on a mission to eliminate middlemen and bring fresh produce directly to your doorstep, ensuring fair prices for farmers and fresh produce for consumers.
                </p>
                <Button className="bg-nature-600 hover:bg-nature-700 text-white">
                  Learn More About Our Journey
                </Button>
              </div>
              <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Farm to table journey" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-nature-100 -z-10"></div>
                <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-nature-50 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

      

        {/* Our Values */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <div className="w-20 h-1 bg-nature-600 mx-auto mb-6"></div>
              <p className="text-gray-600">
                These principles guide everything we do, from how we work with farmers to how we serve our customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="p-4 bg-nature-50 rounded-full inline-flex items-center justify-center mb-6">
                  <Leaf className="h-8 w-8 text-nature-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sustainability</h3>
                <p className="text-gray-600">
                  We promote farming practices that protect the environment and ensure long-term ecological balance.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="p-4 bg-nature-50 rounded-full inline-flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-nature-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">
                  We believe in fostering strong relationships between farmers, consumers, and local communities.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="p-4 bg-nature-50 rounded-full inline-flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-nature-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-600">
                  We continuously seek new ways to improve our platform, logistics, and overall customer experience.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="p-4 bg-nature-50 rounded-full inline-flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-nature-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Transparency</h3>
                <p className="text-gray-600">
                  We provide clear information about our products, pricing, and the journey from farm to table.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <div className="w-20 h-1 bg-nature-600 mx-auto mb-6"></div>
              <p className="text-gray-600">
                Our diverse team of passionate individuals is committed to transforming agriculture and empowering farmers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Kiran Kumar",
                  title: "",
                  image: "/no-profile.svg"
                },
                {
                  name: "Someshwar Charagundla",
                  title: "",
                  image: "/no-profile.svg"
                },
                {
                  name: "Rahen Boppani",
                  title: "",
                  image: "/no-profile.svg"
                },
                {
                  name: "Praveen Vandrasi",
                  title: "",
                  image: "/no-profile.svg"
                },
                {
                  name: "Hemanth Venkata sai",
                  title: "",
                  image: "/no-profile.svg"
                }
              ].map((member, index) => (
                <div key={index} className="relative group animate-fade-up" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                      <p className="text-white/80 text-sm">{member.title}</p>
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4 text-center transform -translate-y-8 group-hover:-translate-y-12 transition-transform duration-300">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" className="border-nature-600 text-nature-600 hover:bg-nature-50">
                View Full Team
              </Button>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="bg-gray-50 rounded-2xl p-12 text-center max-w-4xl mx-auto animate-fade-up">
              <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Whether you're a farmer looking to expand your reach, a consumer seeking fresh produce, or someone passionate about sustainable agriculture, there's a place for you in our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-nature-600 hover:bg-nature-700 text-white">
                  Shop Now
                </Button>
                <Button variant="outline" className="border-nature-600 text-nature-600 hover:bg-nature-50">
                  Partner With Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
