import { Layout } from "@/components/Layout";
import { ArrowRight, Briefcase, Clock, Shield, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

import React from "react";

import { Helmet } from "react-helmet-async";



      <Helmet>

        {/* BASIC SEO */}

        <title>HR Solutions in India | HR Management & Workforce Solutions | Sniper Systems</title>

        <meta
          name="description"
          content="Sniper Systems delivers advanced HR solutions in India including workforce management, HR automation, employee lifecycle management, and digital HR transformation for modern businesses."
        />

        <meta
          name="keywords"
          content="HR solutions India, HR management solutions, workforce management India, HR automation services, employee lifecycle management"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/hr-solutions"
        />

        {/* GEO TAGS */}

        <meta name="geo.region" content="IN-TN" />
<meta name="geo.placename" content="Chennai" />
<meta name="geo.position" content="13.0827;80.2707" />
<meta name="ICBM" content="13.0827, 80.2707" />

        {/* OPEN GRAPH */}

        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="HR Solutions & Workforce Management | Sniper Systems India"
        />

        <meta
          property="og:description"
          content="Streamline HR operations with digital HR solutions, automation, and workforce management systems."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/hr-solutions"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="HR Solutions in India | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Transform HR operations with scalable HR management and workforce solutions."
        />

        <meta
          name="twitter:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        {/* ORGANIZATION SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Sniper Systems",
            "url": "https://sniperindia.com",
            "logo": "https://sniperindia.com/wp-content/uploads/2023/09/logo.png"
          }
          `}
</script>

        {/* SERVICE SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "HR Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "HR solutions including workforce management, HR automation, and employee lifecycle management for enterprises in India."
          }
          `}
</script>

        {/* FAQ SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are HR solutions for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HR solutions include tools and services that help manage employee data, payroll, recruitment, performance, and workforce operations efficiently."
                }
              },
              {
                "@type": "Question",
                "name": "How do HR solutions improve business efficiency?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HR solutions automate repetitive tasks, improve employee engagement, and provide insights for better workforce management."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide HR automation solutions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems offers HR automation and digital HR transformation solutions tailored for enterprise business needs."
                }
              }
            ]
          }
          `}
</script>

        {/* BREADCRUMB SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://sniperindia.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Solutions",
                "item": "https://sniperindia.com/solutions/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "HR Solutions",
                "item": "https://sniperindia.com/solutions/hr-solutions"
              }
            ]
          }
          `}
</script>

      </Helmet>



const HRSolutions = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    {
      title: "Permanent Staffing",
      description:
        "Full-time talent for long-term growth. We find culturally aligned, high-performing candidates that stay.",
    },
    {
      title: "Executive Search",
      description:
        "Board-level and senior leadership recruitment with a discreet, research-backed process.",
    },
    {
      title: "Contract & Temp Hiring",
      description:
        "On-demand professionals for short-term needs, projects, or seasonal roles.",
    },
    {
      title: "Bulk Hiring (RPO)",
      description:
        "End-to-end recruitment process outsourcing to help you scale rapidly without stress.",
    },
  ];

  const employerBenefits = [
    { icon: Clock, label: "Fast turnaround times" },
    { icon: Users, label: "Industry-specific talent pools" },
    { icon: Briefcase, label: "Dedicated account manager" },
  ];

  const jobSeekerBenefits = [
    { icon: Target, label: "Resume & interview support" },
    { icon: Shield, label: "Confidential job matching" },
    { icon: TrendingUp, label: "Direct access to decision-makers" },
  ];

  const industries = [
    { title: "Architecture & Engineering", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
    { title: "Information Technology",     image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" },
    { title: "Healthcare",                 image: "https://i.postimg.cc/1zrqK0Jx/9762653.jpg" },
    { title: "Finance & Accounting",       image: "https://i.postimg.cc/Z0zbg25L/finance.jpg" },
    { title: "Retail & E-commerce",        image: "https://i.postimg.cc/qvbqwk3N/digital.jpg" },
    { title: "Manufacturing",              image: "https://i.postimg.cc/9QRH3Vkw/engineerfactory.jpg" },
    { title: "Logistics & Supply Chain",   image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" },
  ];

  return (
    <Layout>
      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <p className="text-sm sm:text-base md:text-xl text-gray-700 mb-3 sm:mb-4 font-medium">
              Human Resources Consulting That Drives Results
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans">
              Building Better<br />
              Workplaces, Together.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2">
              Expert HR Management Solutions to Recruit Smarter, Hire Better, and Grow Faster.
              We're a results-driven recruitment agency specializing in delivering exceptional candidates across industries. Whether you're scaling your startup or filling a critical executive role, our mission is simple: to find you the right people, at the right time.
              We also offer comprehensive HR management solutions and human resources consulting to help organizations strengthen their internal HR capabilities.
            </p>
          </div>

          {/* Main Image */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-10 md:pt-12">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-80 md:h-[500px] lg:h-[600px]">
              <img
                src="https://i.postimg.cc/nhX8BZYK/business-p).jpg"
                alt="HR Solutions"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6">
                <div className="bg-black bg-opacity-50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium">HR SOLUTIONS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-14 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10 sm:gap-y-14 md:gap-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 sm:gap-6 items-start pb-10 sm:pb-12 border-b border-gray-300"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  {service.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  {service.description}
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center w-fit px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-900 rounded-full text-gray-900 text-sm sm:text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
                >
                  Get started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOR EMPLOYERS ==================== */}
      <section className="bg-black text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-10 md:my-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
              For Employers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mt-6 sm:mt-8">
              Tired of sifting through unqualified resumes? Let us do the heavy lifting.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mt-3 sm:mt-4">
              Our recruiters act as an extension of your HR team—delivering qualified, pre-vetted candidates who are ready to make an impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14 md:mt-16">
            {employerBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <benefit.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  {benefit.label}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <a
              href="/contact"
              className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              Partner with us
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOR JOB SEEKERS ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
              For Job Seekers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mt-6 sm:mt-8">
              Looking for your next big opportunity? We work with leading companies across sectors.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mt-3 sm:mt-4">
              Share your resume and let's find your perfect fit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14 md:mt-16">
            {jobSeekerBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <benefit.icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900" />
                </div>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  {benefit.label}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <a
              href="/contact"
              className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3 sm:py-4 border-2 border-gray-900 rounded-full text-gray-900 font-medium text-base sm:text-lg hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              Submit your resume
            </a>
          </div>
        </div>
      </section>

      {/* ==================== INDUSTRIES ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-14 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Industries we serve
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={industry.image}
                  alt={industry.title}
                  className="w-full h-40 sm:h-44 md:h-48 object-cover"
                />
                <div className="h-16 sm:h-18 md:h-20 flex items-center justify-center p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider text-center">
                    {industry.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-black text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-10 md:my-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 leading-tight">
              Ready to build your<br />dream team?
            </h2>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
          >
            LET'S TALK
          </a>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:left-8 w-11 h-11 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 -rotate-90" />
        </button>
      )}
    </Layout>
  );
};

export default HRSolutions;
