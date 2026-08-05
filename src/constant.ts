
import {
  Users,
  Clock,
  Shield,
  CheckCircle,
  Lightbulb,
  Rocket,
  Sparkles,
  Wallet,
  BadgeCheck,
  Cloud,
  Globe2,
  TrendingUp,
  Eye,
  Compass,
  Zap,
  Cpu,
  Layers,
  Boxes,
  Clapperboard,
  GraduationCap,
  Glasses,
  PieChart,
} from "lucide-react";


//NAVBAR CONTENTS//
// ─── Data ─── //
export const solutionGroups = [
  {
    label: "Infrastructure",
    items: [
      {
        name: "IT Infrastructure",
        href: "/solutions/it-infrastructure",
        desc: "Build robust enterprise infrastructure",
        iconKey: "infra",
      },
      {
        name: "Networking Solutions",
        href: "/solutions/networking-solutions",
        desc: "Enterprise-grade network architecture",
        iconKey: "network",
      },
      {
        name: "Cloud Solutions",
        href: "/solutions/clould-solutions",
        desc: "Scalable cloud infrastructure & services",
        iconKey: "cloud",
      },
    ],
  },
  {
    label: "Managed Services",
    items: [
      {
        name: "Managed IT Services",
        href: "/solutions/managed-it-services",
        desc: "Complete end-to-end IT support",
        iconKey: "managed",
      },
      {
        name: "IT Consulting",
        href: "/solutions/it-consulting",
        desc: "Expert technology guidance & strategy",
        iconKey: "consulting",
      },
      {
        name: "Device Deployment & MDM",
        href: "/solutions/device-deployment-mdm",
        desc: "Seamless device lifecycle management",
        iconKey: "device",
      },
    ],
  },
  {
    label: "Business Solutions",
    items: [
      {
        name: "HR Solutions",
        href: "/solutions/hr-solutions",
        desc: "Streamline your HR operations",
        iconKey: "hr",
      },
      {
        name: "Payment Services",
        href: "/solutions/payment-services",
        desc: "Secure and reliable payment processing",
        iconKey: "payment",
      },
    ],
  },
  {
    label: "Specialty",
    items: [
      {
        name: "AV Solutions",
        href: "/solutions/av-solutions",
        desc: "Professional audio-visual systems",
        iconKey: "av",
      },
      {
        name: "IT Asset Disposal",
        href: "/solutions/it-asset-disposal",
        desc: "Secure disposal & lifecycle mgmt",
        iconKey: "disposal",
      },
    ],
  },
];

export const industryGroups = [
  {
    label: "Technology",
    items: [
      {
        name: "IT / ITES / Infrastructure",
        href: "/industries/it-ites-infra",
        desc: "Technology infrastructure management",
        iconKey: "it",
      },
      {
        name: "AR / VR / MR / XR",
        href: "/industries/ar-vr-mr-xr",
        desc: "Immersive extended reality technology",
        iconKey: "xr",
      },
    ],
  },
  {
    label: "Creative & Public",
    items: [
      {
        name: "Media & Entertainment",
        href: "/industries/media-and-entertainment",
        desc: "Creative production & broadcast solutions",
        iconKey: "media",
      },
      {
        name: "Government Sector",
        href: "/industries/government",
        desc: "Secure public sector IT solutions",
        iconKey: "govt",
      },
    ],
  },
  {
    label: "Industrial",
    items: [
      {
        name: "AEC",
        href: "/industries/aec",
        desc: "Architecture, Engineering & Construction",
        iconKey: "aec",
      },
      {
        name: "Manufacturing & Automotive",
        href: "/industries/manufacturing-automotive",
        desc: "Industrial automation & IT solutions",
        iconKey: "mfg",
      },
    ],
  },
  {
    label: "Health & Education",
    items: [
      {
        name: "Healthcare & Pharma",
        href: "/industries/healthcare-pharma",
        desc: "Medical technology & compliance solutions",
        iconKey: "health",
      },
      {
        name: "Education",
        href: "/industries/education",
        desc: "EdTech and digital learning solutions",
        iconKey: "edu",
      },
    ],
  },
];

export const partnerGroups = [
  {
    label: "Hardware",
    items: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Samsung"],
  },
  {
    label: "Software & Cloud",
    items: [
      "Microsoft",
      "Adobe",
      "Autodesk",
      "AWS",
      "Azure",
      "Unity",
      "Unreal Engine",
    ],
  },
  {
    label: "Networking & Security",
    items: ["Cisco", "Yubico", "JAMF", "Logitech", "Nvidia"],
  },
];

//UNREAL ENGINE PAGE//
export const useCases = [
  {
    tag: "USE CASE 01",
    title: "Immersive Training",
    description:
      "Explore popular unity industry use cases that unlock the potential of 3D data to achieve real business goals",
    gradient:
      "linear-gradient(115deg, #1a1a2e 0%, #e0393e 28%, #f5a623 52%, #f7e35f 66%, #3fa9f5 100%)",
  },
  {
    tag: "USE CASE 02",
    title: "3D Collaboration",
    description:
      "Explore popular unity industry use cases that unlock the potential of 3D data to achieve real business goals",
    gradient: "linear-gradient(115deg, #38bdf8 0%, #6d5bf0 55%, #8b5cf6 100%)",
  },
  {
    tag: "USE CASE 03",
    title: "Customer Experiences",
    description:
      "Explore popular unity industry use cases that unlock the potential of 3D data to achieve real business goals",
    gradient: "linear-gradient(115deg, #f9a8c9 0%, #f7c6d9 50%, #fbe4ec 100%)",
  },
  {
    tag: "USE CASE 04",
    title: "Embedded Systems",
    description:
      "Explore popular unity industry use cases that unlock the potential of 3D data to achieve real business goals",
    gradient:
      "linear-gradient(115deg, #1a1030 0%, #2d1b52 40%, #5b3fd6 75%, #7c5cff 100%)",
  },
];

// Business Advantages of Real-Time 3D — bento grid
export const bentoItems = [
  {
    icon: Users,
    label: "Improve engineering collaboration",
    description:
      "Engineers, architects, and designers work inside the same live 3D environment instead of passing static files back and forth.",
    bg: "from-violet-800/40 to-violet-950/40",
    span: "col-span-2 row-span-2",
    big: true,
  },
  {
    icon: Rocket,
    label: "Accelerate product development",
    description:
      "Iterate on designs in real time and shorten the gap between concept and validated decision.",
    bg: "from-fuchsia-800/30 to-[#150826]",
  },
  {
    icon: Sparkles,
    label: "Enhance customer engagement",
    description:
      "Let customers explore products in photorealistic, interactive detail before they buy.",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Wallet,
    label: "Reduce physical prototyping costs",
    description:
      "Validate designs virtually first, cutting down on costly physical mockups and rework.",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Globe2,
    label: "Support remote collaboration",
    description:
      "Distributed teams review and iterate on the same live scene from anywhere.",
    bg: "from-fuchsia-800/30 to-[#150826]",
    span: "col-span-2",
  },
  {
    icon: TrendingUp,
    label: "Increase workforce productivity",
    description:
      "Faster reviews and fewer redo cycles mean teams spend more time building, less time waiting.",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Eye,
    label: "Improve operational visibility",
    description:
      "Real-time dashboards turn operational data into something teams can actually see and act on.",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Compass,
    label: "Enable immersive decision-making",
    description:
      "Walk through a facility or product before it's built, and make the call with real context.",
    bg: "from-fuchsia-800/30 to-[#150826]",
  },
  {
    icon: Zap,
    label: "Drive digital transformation initiatives",
    description:
      "Real-time 3D becomes the shared visual layer connecting IoT, cloud, and AI initiatives.",
    bg: "from-violet-800/30 to-[#150826]",
  },
];
// Why Organizations Choose Unreal Engine (platform capabilities)
export const whyChooseUnrealEngine = [
  {
    icon: Sparkles,
    label: "Photorealistic Visualization",
    description:
      "Communicate ideas with exceptional realism through dynamic lighting, physically based rendering, advanced materials, reflections, and cinematic-quality visuals — whether showcasing industrial equipment, architectural projects, automotive designs, or consumer products. Key benefits: faster design validation, better customer presentations, improved stakeholder communication, reduced design revisions, and enhanced marketing experiences.",
  },
  {
    icon: Users,
    label: "Real-Time Collaboration",
    description:
      "Enterprise projects involve multiple teams working across different locations and disciplines. Unreal Engine enables stakeholders to collaborate within shared digital environments, allowing engineers, architects, designers, decision-makers, and customers to interact with projects in real time — improving communication, accelerating approvals, and reducing costly project delays.",
  },
  {
    icon: Cpu,
    label: "Enterprise Digital Twins",
    description:
      "Digital twins provide a live digital representation of physical assets, facilities, infrastructure, or manufacturing environments. By integrating IoT sensors, cloud platforms, engineering data, and AI analytics, organizations gain real-time visibility into operational performance while improving predictive maintenance, resource utilization, and business intelligence.",
  },
  {
    icon: Layers,
    label: "Cross-Platform Experiences",
    description:
      "Applications developed with Unreal Engine can be deployed across desktops, mobile devices, web browsers, VR headsets, AR devices, immersive display systems, and cloud-based streaming environments — reaching users across departments, locations, and devices while maintaining a consistent, high-quality experience.",
  },
];

export const solutions = [
  {
    title: "Real-Time Enterprise Visualization",
    description:
      "Bring engineering designs, architectural models, manufacturing facilities, and operational data to life through interactive visualization.",
    descriptionn:
      "Applications include engineering and infrastructure visualization, facility walkthroughs, product showcases, executive dashboards, and customer demonstrations.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=70",
    tags: [
      "Engineering Visualization",
      "Facility Walkthroughs",
      "Executive Dashboards",
    ],
  },
  {
    title: "Interactive Product Experiences",
    description:
      "Develop interactive product configurators and immersive sales experiences that let users personalize products and explore configurations in real time.",
    descriptionn:
      "Capabilities include product customization, interactive configurators, virtual showrooms, sales presentations, and online visualization platforms.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=70",
    tags: ["Product Configurators", "Virtual Showrooms", "Sales Presentations"],
  },
  {
    title: "Enterprise Simulation & Training",
    description:
      "Build highly realistic simulations using Unreal Engine that improve workforce readiness while reducing operational risks and training costs.",
    descriptionn:
      "Applications include industrial safety training, equipment operation, maintenance procedures, emergency response, and healthcare simulation.",
    image:
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=1200&auto=format&fit=crop&q=70",
    tags: ["Safety Training", "Equipment Simulation", "Emergency Response"],
  },
  {
    title: "Virtual Production Solutions",
    description:
      "Implement Unreal Engine-powered virtual production pipelines that improve efficiency while maintaining exceptional visual quality.",
    descriptionn:
      "Solutions include virtual studios, LED volume workflows, broadcast graphics, live event visualization, and motion capture integration.",
    image:
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=1200&auto=format&fit=crop&q=70",
    tags: ["LED Volume", "Broadcast Graphics", "Motion Capture"],
  },
  {
    title: "Extended Reality (XR)",
    description:
      "Enable AR, VR, and mixed reality experiences that improve collaboration, remote assistance, design validation, and workforce training.",
    descriptionn:
      "Use cases include remote collaboration, virtual walkthroughs, interactive maintenance, product demonstrations, and smart manufacturing.",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&auto=format&fit=crop&q=70",
    tags: [
      "Remote Collaboration",
      "Virtual Walkthroughs",
      "Smart Manufacturing",
    ],
  },
];
// Enterprise Solutions Built with Unreal Engine — capability card grid (3 top / 2 bottom)
export const keyFeatures = [
  {
    icon: Eye,
    title: "Real-Time Enterprise Visualization",
    description:
      "Bring engineering designs, architectural models, manufacturing facilities, industrial assets, and operational data to life through interactive visualization.",
    tags: [
      "Engineering visualization",
      "Infrastructure visualization",
      "Facility walkthroughs",
      "Product showcases",
    ],
    moreCount: 2,
    span: "lg:col-span-2",
  },
  {
    icon: Boxes,
    title: "Interactive Product Experiences",
    description:
      "These solutions help organizations improve customer engagement, shorten sales cycles, and enhance buying confidence.",
    tags: [
      "Product customization",
      "Interactive configurators",
      "Virtual showrooms",
      "Sales presentations",
    ],
    moreCount: 2,
    span: "lg:col-span-2",
  },
  {
    icon: GraduationCap,
    title: "Enterprise Simulation & Training",
    description:
      "Using Unreal Engine, organizations can build highly realistic simulations that improve workforce readiness while reducing operational risks.",
    tags: [
      "Industrial safety training",
      "Equipment operation",
      "Maintenance procedures",
      "Emergency response",
    ],
    moreCount: 3,
    span: "lg:col-span-2",
  },
  {
    icon: Clapperboard,
    title: "Virtual Production Solutions",
    description:
      "Implement Unreal Engine-powered virtual production pipelines that improve efficiency while maintaining exceptional visual quality.",
    tags: [
      "Virtual studios",
      "LED volume workflows",
      "Broadcast graphics",
      "Motion capture integration",
    ],
    moreCount: 3,
    span: "lg:col-span-3",
  },
  {
    icon: Glasses,
    title: "Extended Reality (XR)",
    description:
      "Enable AR, VR, and mixed reality experiences for remote collaboration, design validation, and workforce training.",
    tags: [
      "Remote collaboration",
      "Virtual walkthroughs",
      "Interactive maintenance",
      "Smart manufacturing",
    ],
    moreCount: 3,
    span: "lg:col-span-3",
  },
];
// Why Organizations Choose Sniper — bento grid
export const partnerItems = [
  {
    icon: BadgeCheck,
    label: "Authorized Unreal Engine Partner",
    bg: "from-violet-800/40 to-violet-950/40",
    span: "col-span-2 row-span-2",
    big: true,
  },
  {
    icon: Users,
    label: "Enterprise-focused consulting",
    bg: "from-fuchsia-800/30 to-[#150826]",
  },
  {
    icon: Compass,
    label: "Experienced solution architects",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Layers,
    label: "Industry-specific expertise",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Cloud,
    label: "Cloud and AI integration",
    bg: "from-fuchsia-800/30 to-[#150826]",
    span: "col-span-2",
  },
  {
    icon: Boxes,
    label: "End-to-end implementation",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Globe2,
    label: "Pan-India delivery and support",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    icon: Zap,
    label: "Managed services and optimization",
    bg: "from-fuchsia-800/30 to-[#150826]",
  },
  {
    icon: TrendingUp,
    label: "Long-term technology partnership",
    bg: "from-violet-800/30 to-[#150826]",
  },
  {
    label: "Cloud & AI Integration",
    description: "Integrate cloud platforms and AI analytics with real-time 3D environments for enhanced operational insights.",
    tag: "Managed Services",
  },
];
export const faqs = [
  {
    question: "Why Unreal Engine for enterprise?",
    answer:
      "Unreal Engine offers photorealistic rendering, real-time collaboration, and cross-platform deployment — giving enterprises a single ecosystem for visualization, simulation, and immersive training.",
  },
  {
    question: "Can you integrate with ERP systems?",
    answer:
      "Yes. We build custom data pipelines that connect Unreal Engine applications with ERP, PLM, and IoT platforms so your visualizations stay in sync with live operational data.",
  },
  {
    question: "Do you build Digital Twins?",
    answer:
      "We develop enterprise digital twins that combine IoT sensor data, cloud platforms, and AI analytics for real-time monitoring, predictive maintenance, and operational insight.",
  },
  {
    question: "Do you provide long-term support?",
    answer:
      "Yes — we offer managed services, ongoing optimization, and pan-India technical support for every Unreal Engine solution we deliver.",
  },
  {
    question: "Can existing CAD models be imported?",
    answer:
      "Most industry-standard CAD and BIM formats can be imported and optimized for real-time rendering in Unreal Engine, preserving engineering accuracy.",
  },
];
export const WORK_PROJECTS = [
  {
    id: "work-project-3",
    title: "YCF DEV",
    services: ["Portfolio", "Partnership", "UI UX Design"],
    imageUrl:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "work-project-2",
    title: "Marketing Agency",
    services: ["Partnership", "UI UX Design", "Development"],
    imageUrl:
      "https://images.unsplash.com/photo-1683803055067-1ca1c17cb2b9?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "work-project-1",
    title: "Stridath Ecommerce",
    services: ["E-Commerce", "Branding", "UI UX Design", "Development"],
    imageUrl:
      "https://images.unsplash.com/photo-1688561808434-886a6dd97b8c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
export const ACHIEVEMENTS = [
  {
    id: "achivement-1",
    title: "4",
    description: "site of the day",
    bg: "bg-indigo-500",
  },
  {
    id: "achivement-2",
    title: "60+",
    description: "website created",
    bg: "bg-emerald-500",
  },
  {
    id: "achivement-3",
    title: "5+",
    description: "years of experience",
    bg: "bg-pink-500",
  },
  {
    id: "achivement-4",
    title: "6+",
    description: "component created",
    bg: "bg-purple-500",
  },
];

//Home Page//
export const banners = [
  {
    title: "POWERFUL TECHNOLOGY SOLUTIONS",
    description:
      "Enterprise infrastructure, managed services, and business solutions designed to support your organization's growth and digital transformation.",
    image:
      "https://i.postimg.cc/nhLN25ph/futuristic-business-scene-with-ultra-modern-ambiance.jpg",
    link: "/Solutions",
  },
  {
    title: "SERVING DIVERSE INDUSTRIES",
    description:
      "Technology solutions for industries like technology, media, healthcare, education, and manufacturing.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    link: "/Industries",
  },
  {
    title: "APPLE SOLUTIONS FOR BUSINESS & EDUCATION",
    description:
      "Apple Business Partner enabling businesses with powerful devices and streamlined IT management.",
    image: "https://i.postimg.cc/RVVDHpLZ/desktop.jpg",
    link: "partners/apple/index.html",
  },
  {
    title: "APPLE PREMIUM EDUCATION PARTNER",
    description:
      "Apple devices like MacBook, iPad, and iMac designed for classrooms, labs, and smarter campus learning.",
    image: "https://i.postimg.cc/0NQnVgDJ/hero-nw00556jozu6-large-2x.jpg", // (replace if you have better asset)
    link: "partners/apple-education/index.html",
  },
  {
    title: "SCALABLE CLOUD INNOVATION",
    description:
      "Secure cloud infrastructure, smooth migration, and optimized management for modern digital enterprises.",
    image:
      "https://i.postimg.cc/ZY3RhJ0v/cyber-security-concept-digital-art.jpg",
    link: "partners/cloud-solutions/index.html",
  },
  {
    title: "LET'S BUILD YOUR DIGITAL FUTURE",
    description:
      "Upgrade infrastructure, deploy devices, or move to the cloud with expert technology support.",
    image: "https://i.postimg.cc/k4gps4WP/ai-data-analysis-team.jpg",
    link: "/contact",
  },
];
export const logoCompanies = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    w: 108,
    h: 38,
  },
  {
    name: "Lenovo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg",
    w: 98,
    h: 38,
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    w: 108,
    h: 28,
  },
  {
    name: "NVIDIA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Autodesk",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg",
    w: 108,
    h: 48,
  },
  {
    name: "Unreal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg",
    w: 118,
    h: 58,
  },
  {
    name: "Cisco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    w: 108,
    h: 38,
  },
  {
    name: "Unity",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1280px-Unity_Technologies_logo.svg.png",
    w: 108,
    h: 38,
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Dell",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
    w: 108,
    h: 58,
  },
  {
    name: "HP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
    w: 108,
    h: 58,
  },
  {
    name: "AWS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    w: 108,
    h: 48,
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Samsung_Black_icon.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Acer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Asus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    w: 108,
    h: 25,
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    w: 108,
    h: 38,
  },
  {
    name: "Supermicro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Super_Micro_Computer_Logo.svg",
    w: 108,
    h: 40,
  },
  {
    name: "Yubico",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Yubico_logo.svg",
    w: 108,
    h: 25,
  },
  {
    name: "Poly",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Poly_Inc._Logo.svg",
    w: 108,
    h: 38,
  },
  {
    name: "Epos",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/58/Epos-logo.png",
    w: 108,
    h: 28,
  },
  {
    name: "Eizo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/EIZO_Logo.svg",
    w: 100,
    h: 68,
  },
  {
    name: "View Sonic",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/ViewSonic_logo.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Belkin",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Belkin_logo_2024.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Honey well",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Logitech",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Jabra",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Jabra_Logo.png",
    w: 108,
    h: 28,
  },
  {
    name: "Benq",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/BenQ_wordmark.svg",
    w: 95,
    h: 28,
  },
  {
    name: "SketchUp",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Brand_Wordmark_for_SketchUp.png",
    w: 108,
    h: 28,
  },
  {
    name: "Sap",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    w: 108,
    h: 28,
  },
  {
    name: "LG",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg",
    w: 108,
    h: 28,
  },
  {
    name: "Keyshot",
    logo: "https://www.freelogovectors.net/wp-content/uploads/2018/11/keyshot-logo.png",
    w: 108,
    h: 28,
  },
  {
    name: "Jumpcloud",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/47/JumpCloud_Logo.svg",
    w: 108,
    h: 38,
  },
];

export const benefits = [
  {
    icon: Clock,
    label: "EXPERIENCE YOU CAN TRUST",
    description:
      "With 15+ years of experience, our IT solutions are seamless, reliable, and tailored for businesses across any location or time zone.",
  },
  {
    icon: Shield,
    label: "READY FOR ANY CHALLENGE",
    description:
      '"Impossible" isn\'t in our vocabulary. We deliver solutions exactly as designed—no shortcuts, no compromises, just results.',
  },
  {
    icon: CheckCircle,
    label: "SOLUTIONS BUILT FOR YOU",
    description:
      "Every business is unique. Our IT strategies, managed services, and technology integrations are customized to fit your exact needs.",
  },
  {
    icon: Lightbulb,
    label: "PARTNERSHIPS THAT MATTER",
    description:
      "As authorized resellers of Apple, Autodesk, Adobe, Unity, and more, we combine global technology with local expertise for maximum impact.",
  },
  {
    icon: Zap,
    label: "RELIABLE SUPPORT, ALWAYS",
    description:
      "Monitoring and support ensure your operations run smoothly, securely, and without interruption.",
  },
];

export const clientTypes = [
  {
    title: "Large Enterprises",
    image: "https://i.postimg.cc/xd6t2gKZ/business.jpg",
  },
  {
    title: "Mid-Enterprise & Scale-ups",
    image: "https://i.postimg.cc/6pm8xv7J/employees.jpg",
  },
  {
    title: "Global Capability Centers (GCCs)",
    image:
      "https://i.postimg.cc/kXNNCf99/3d-realistic-globe-with-musical-elements.jpg",
  },
  {
    title: "Startups & Emerging Businesses",
    image: "https://i.postimg.cc/YCk3LT8G/businesswoman.jpg",
  },
  {
    title: "Developers & Tech Teams",
    image: "https://i.postimg.cc/sX8BsRB6/coders.jpg",
  },
  {
    title: "Educational Institutions",
    image:
      "https://i.postimg.cc/SNnr6y7s/old-masters-picture-gallery-dresden-night.jpg",
  },
];

export const partners = [
  {
    name: "Zoho",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/ZOHO_logo_2023.svg",
    maxWidth: "82px",
    maxHeight: "48px",
  },
  {
    name: "Larsen & Toubro",
    logo: "https://upload.wikimedia.org/wikipedia/en/a/a1/Larsen%26Toubro_logo.svg",
    maxWidth: "42px",
    maxHeight: "44px",
  },
  {
    name: "Deloitte",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_Deloitte.svg",
    maxWidth: "90px",
    maxHeight: "24px",
  },
  {
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b1/Tata_Consultancy_Services.svg",
    maxWidth: "85px",
    maxHeight: "42px",
  },
  {
    name: "Infosys",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    maxWidth: "88px",
    maxHeight: "28px",
  },
  {
    name: "KPMG",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/KPMG_blue_logo.svg",
    maxWidth: "72px",
    maxHeight: "32px",
  },
  {
    name: "ISRO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg",
    maxWidth: "59px",
    maxHeight: "64px",
  },
  {
    name: "Verizon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Verizon_2024.svg",
    maxWidth: "88px",
    maxHeight: "24px",
  },
  {
    name: "Paytm",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
    maxWidth: "76px",
    maxHeight: "30px",
  },
  {
    name: "Apollo Hospitals",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c5/Apollo_Hospitals_Logo.svg",
    maxWidth: "55px",
    maxHeight: "68px",
  },
  {
    name: "Metropolis",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Metropolis_Healthcare_Logo_Green_Background.png",
    maxWidth: "90px",
    maxHeight: "40px",
  },
  {
    name: "Athenahealth",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7b/Athenahealth.svg",
    maxWidth: "110px",
    maxHeight: "28px",
  },
  {
    name: "AstraZeneca",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/AstraZeneca.svg",
    maxWidth: "105px",
    maxHeight: "28px",
  },
  {
    name: "Ashok Leyland",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Ashok_Leyland_logo.svg",
    maxWidth: "100px",
    maxHeight: "30px",
  },
  {
    name: "Razorpay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
    maxWidth: "95px",
    maxHeight: "28px",
  },
  {
    name: "Rane",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b8/Rane_Group_Logo.jpg",
    maxWidth: "58px",
    maxHeight: "40px",
  },
  {
    name: "KONE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Kone_Logo_2023.svg",
    maxWidth: "70px",
    maxHeight: "30px",
  },
  {
    name: "Accenture",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
    maxWidth: "95px",
    maxHeight: "26px",
  },
  {
    name: "Daimler",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b0/Daimler_logo.svg",
    maxWidth: "74px",
    maxHeight: "40px",
  },
  {
    name: "Rockstar Games",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg",
    maxWidth: "40px",
    maxHeight: "40px",
  },
  {
    name: "Karnataka High Court",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1f/Logo_of_Karnataka_High_Court.png",
    maxWidth: "62px",
    maxHeight: "52px",
  },
  {
    name: "GE Vernova",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/GE_Vernova_logo.svg",
    maxWidth: "110px",
    maxHeight: "28px",
  },
  {
    name: "C-DAC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Logo_for_the_Centre_for_Development_of_Advanced_Computing.svg",
    maxWidth: "60px",
    maxHeight: "40px",
  },
  {
    name: "Technicolor",
    logo: "https://upload.wikimedia.org/wikipedia/en/e/ec/Technicolor_Group.svg",
    maxWidth: "100px",
    maxHeight: "28px",
  },
  {
    name: "NDTV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/NDTV_logo.svg",
    maxWidth: "80px",
    maxHeight: "28px",
  },

  {
    name: "Grow",
    logo: "https://i.postimg.cc/rpF0wXSw/groww-logo.webp",
    maxWidth: "90px",
    maxHeight: "38px",
  },
  {
    name: "amagi",
    logo: "https://i.postimg.cc/RhQ4tqmB/amagi-logo.webp",
    maxWidth: "90px",
    maxHeight: "38px",
  },

  {
    name: "Disney+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Disney%2B_2024.svg",
    maxWidth: "95px",
    maxHeight: "38px",
  },
  {
    name: "SBI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/State_Bank_of_India.svg",
    maxWidth: "65px",
    maxHeight: "60px",
  },
  {
    name: "Indian Navy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Indian_Navy_Insignia.svg",
    maxWidth: "65px",
    maxHeight: "55px",
  },
  {
    name: "Brigade Group",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/8e/Brigade_Group.svg",
    maxWidth: "100px",
    maxHeight: "48px",
  },
  {
    name: "Asianet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Asianet_2023_logo.png",
    maxWidth: "90px",
    maxHeight: "42px",
  },
  {
    name: "ChuChu TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d8/ChuChu_TV-logo.JPG",
    maxWidth: "70px",
    maxHeight: "45px",
  },

  {
    name: "Chargebee",
    logo: "https://i.postimg.cc/rsg7c4cz/6ec7fd89-42a8-4a53-a0d4-252515d5a1c2.png",
    maxWidth: "140px",
    maxHeight: "78px",
  },

  {
    name: "Bluestone",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Bluestone_Group_logo_mid_resolution.jpg",
    maxWidth: "120px",
    maxHeight: "56px",
  },
  {
    name: "Freshworks",
    logo: "https://brandlogos.net/wp-content/uploads/2024/04/freshworks-logo_brandlogos.net_c6t5u.png",
    maxWidth: "100px",
    maxHeight: "28px",
  },
  {
    name: "Amagi",
    logo: "https://iabm-cdn.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/05/18132311/amagi-media-labs-pvt-ltd.webp",
    maxWidth: "90px",
    maxHeight: "28px",
  },
  {
    name: "Highspot",
    logo: "https://cdn-public.softwarereviews.com/production/logos/offerings/8290/large/Highspot_logo.png?1617162059",
    maxWidth: "90px",
    maxHeight: "38px",
  },
  {
    name: "Embassy Group",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9e/Embassy_Group.svg",
    maxWidth: "100px",
    maxHeight: "38px",
  },
  {
    name: "Swiggy",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Swiggy_Logo.svg",
    maxWidth: "100px",
    maxHeight: "38px",
  },

  {
    name: "postman",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png",
    maxWidth: "90px",
    maxHeight: "38px",
  },
  {
    name: "Cognizant",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },
  {
    name: "amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/06/Amazon_2024.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },
  {
    name: "wipro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Wipro_new_logo.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },
  {
    name: "Walmart",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Walmart_logo_%282025%29.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },

  {
    name: "Capgemini",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Capgemini_New_logo.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },

  {
    name: "Sharechat",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/88/Sharechat_Logo_with_Wordmark.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },

  {
    name: "Zerodha",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Zerodha_logo.svg",
    maxWidth: "90px",
    maxHeight: "38px",
  },
];
