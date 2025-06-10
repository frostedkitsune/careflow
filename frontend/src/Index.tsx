import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ClipboardList, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    features: false,
    process: false,
    cta: false
  });
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === featuresRef.current) {
            setIsVisible(prev => ({ ...prev, features: entry.isIntersecting }));
          } else if (entry.target === processRef.current) {
            setIsVisible(prev => ({ ...prev, process: entry.isIntersecting }));
          } else if (entry.target === ctaRef.current) {
            setIsVisible(prev => ({ ...prev, cta: entry.isIntersecting }));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (processRef.current) observer.unobserve(processRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-teal-600" />,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with your healthcare provider in just a few clicks.'
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-teal-600" />,
      title: 'Digital Health Records',
      description: 'Access your medical records anytime, anywhere. All your information in one secure place.'
    },
    {
      icon: <UserPlus className="h-8 w-8 text-teal-600" />,
      title: 'Patient Management',
      description: 'Healthcare providers can efficiently manage patient data and appointments.'
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-600" />,
      title: 'Secure & Confidential',
      description: 'Your health information is protected with industry-leading security measures.'
    }
  ];

  const process = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up and complete your profile with basic information.'
    },
    {
      number: '02',
      title: 'Browse Doctors',
      description: 'Find healthcare professionals based on specialty and availability.'
    },
    {
      number: '03',
      title: 'Book Appointment',
      description: 'Select a convenient time slot and confirm your appointment.'
    },
    {
      number: '04',
      title: 'Receive Care',
      description: 'Visit your doctor and get the care you need.'
    }
  ];

  return (
    <div className="min-h-screen bg-careflow-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-6 px-4 py-2 bg-teal-600/20 rounded-full text-teal-600 text-sm font-medium inline-flex items-center">
              <span>Modern Healthcare Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-careflow-dark-blue">
              CareFlow: Healthcare Solution
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-8 max-w-2xl">
                Streamline your healthcare experience. CareFlow makes managing patient data, appointments, and health records simple and seamless for both patients and healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary-gradient px-8 py-6 text-base" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
            
            {/* Decorative Element */}
            <div className="mt-16 relative w-full max-w-4xl">
              <div className="bg-gradient-to-b from-careflow-blue/10 to-transparent rounded-3xl p-1">
                <div className="glass-panel rounded-3xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="Healthcare professional with patient" 
                    className="w-full h-auto object-cover rounded-3xl"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-elevated px-6 py-4 flex items-center justify-center w-auto animate-pulse">
                <Calendar className="text-teal-600 mr-2" size={20} />
                <span className="text-careflow-dark-blue font-medium">Next available: Today at 2:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-careflow-dark-blue">
              Features designed with care
            </h2>
            <p className="text-careflow-gray text-lg">
              Our platform provides all the tools you need for efficient healthcare management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible.features ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-teal-600/30 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-careflow-dark-blue">{feature.title}</h3>
                <p className="text-careflow-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section 
        ref={processRef}
        className="py-16 md:py-24 bg-teal-600/5"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-careflow-dark-blue">
              How CareFlow works
            </h2>
            <p className="text-careflow-gray text-lg">
              A simple four-step process to streamline your healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible.process ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-6 h-full">
                  <div className="text-teal-600 text-4xl font-bold mb-4 opacity-50">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-careflow-dark-blue">{step.title}</h3>
                  <p className="text-careflow-gray">{step.description}</p>
                </div>
                
                {/* Arrow connecting steps */}
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="text-teal-600" size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 md:py-32"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-teal-600 to-teal-900 rounded-3xl p-10 md:p-16 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your healthcare experience?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Join thousands of patients and healthcare providers who are already using CareFlow to simplify healthcare management.
            </p>
            <Button 
              className="bg-white text-teal-700 hover:bg-white px-8 py-6 text-base rounded-xl"
              asChild
            >
              <Link to="/login">Log In</Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-teal-600 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">CareFlow</h3>
              <p className="text-white/70 mt-2">Streamlined healthcare management</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/appointments" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/records" className="text-white/70 hover:text-white transition-colors">
                Github
              </Link>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} CareFlow. All rights reserved.</p>
            <p className="mt-2">
              open source software
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
