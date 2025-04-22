
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-nature-50/70 to-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-up">Get In Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Have questions about our products, delivery areas, or want to join our network? We're here to help!
            </p>
          </div>
        </section>

        {/* Contact Information & Form Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Feel free to reach out to us using any of the contact methods below. Our team is available Monday through Friday from 9 AM to 6 PM.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex items-start">
                      <div className="p-3 bg-nature-50 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-nature-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Our Location</h3>
                        <p className="text-sm text-gray-600">
                          Aryabhatta Hostel,IIT Patna<br />
                          Bihta ,Patna<br />
                          Bihar,India
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex items-start">
                      <div className="p-3 bg-nature-50 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-nature-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Phone Number</h3>
                        <p className="text-sm text-gray-600">
                          Customer Service: 9014918500<br />
                          Farmer Support:9014918500<br />
                          <span className="text-nature-600">Toll-Free: 1-800-GreenBridge</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex items-start">
                      <div className="p-3 bg-nature-50 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-nature-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Email Address</h3>
                        <p className="text-sm text-gray-600">
                          General Inquiries: <a href="mailto:info@greenbridge.com" className="text-nature-600 hover:underline">info@greenbridge.com</a><br />
                          Customer Support: <a href="mailto:support@greenbridge.com" className="text-nature-600 hover:underline">support@greenbridge.com</a><br />
                          Partnerships: <a href="mailto:partners@greenbridge.com" className="text-nature-600 hover:underline">partners@greenbridge.com</a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex items-start">
                      <div className="p-3 bg-nature-50 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-nature-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Working Hours</h3>
                        <p className="text-sm text-gray-600">
                          Monday - Friday: 9 AM - 6 PM<br />
                          Saturday: 10 AM - 4 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden shadow-md h-72 mb-8">
                  <iframe 
                    src="https://www.google.com/maps/@25.5369189,84.8463663,15z?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="GreenBridge Location"
                  ></iframe>
                </div>
              </div>

              {/* Contact Form */}
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <MessageSquare className="h-6 w-6 text-nature-600 mr-3" />
                    <h2 className="text-2xl font-bold">Send a Message</h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below, and we'll get back to you as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                        required 
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows={5} 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                        required
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full bg-nature-600 hover:bg-nature-700 text-white flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Find quick answers to common questions about our services, delivery, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  question: "What areas do you deliver to?",
                  answer: "We currently deliver to most areas within a 50-mile radius of Sunnyvale, CA. This includes San Francisco, San Jose, Palo Alto, Mountain View, and surrounding areas. Enter your zip code at checkout to confirm delivery availability."
                },
                {
                  question: "How fresh are your products?",
                  answer: "Our products are harvested only after you place an order. Most produce is picked within 24 hours of delivery, ensuring maximum freshness and nutritional value."
                },
                {
                  question: "How do I become a partner farmer?",
                  answer: "To become a partner farmer, please fill out the application form on our 'Farmers' page or contact us directly at partners@agrocraft.com. Our team will review your application and get in touch within 3-5 business days."
                },
                {
                  question: "What if I'm not satisfied with my order?",
                  answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with your order, please contact our customer service team within 24 hours of delivery, and we'll make it right."
                },
                {
                  question: "How are the farmers paid?",
                  answer: "We believe in fair compensation for our farmers. They receive 70-80% of the final sale price, compared to the 20-30% they might receive through traditional retail channels."
                },
                {
                  question: "Do you offer subscription options?",
                  answer: "Yes! We offer flexible subscription plans that can be customized to your preferences. Choose weekly, bi-weekly, or monthly deliveries and pause or modify your subscription at any time."
                },
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button className="bg-nature-600 hover:bg-nature-700 text-white">
                Contact Our Support Team
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
