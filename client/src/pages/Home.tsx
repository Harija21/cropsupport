import { Link, useLocation } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Leaf, ShieldAlert, CloudSun, Users, Bot, Star,
  CheckCircle2, Zap, Globe, TrendingUp, MessageCircle, Camera,
  ChevronDown, Sprout, BarChart3, Award
} from "lucide-react";
import { useUser } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
});

export default function Home() {
  const { data: user } = useUser();
  const [, setLocation] = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user, setLocation]);

  const features = [
    {
      icon: Bot,
      title: "AI Agronomist",
      desc: "Ask any farming question and receive region-specific, season-aware answers powered by Google Gemini AI.",
      color: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      href: "/ai",
      badge: "Most Used"
    },
    {
      icon: Camera,
      title: "Crop Disease Detection",
      desc: "Upload a photo of any crop leaf — our AI instantly identifies diseases and prescribes treatments.",
      color: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      iconColor: "text-rose-600",
      href: "/disease",
      badge: "AI Powered"
    },
    {
      icon: CloudSun,
      title: "Smart Weather Advisory",
      desc: "Hyper-local weather insights with AI-generated farming advisories tailored to your location.",
      color: "from-sky-500 to-blue-600",
      bg: "bg-sky-50",
      iconColor: "text-sky-600",
      href: "/weather",
      badge: "Real-time"
    },
    {
      icon: Users,
      title: "Farmer Community",
      desc: "Connect with farmers in your region, share experiences, and grow together as a community.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      href: "/community",
      badge: "Social"
    },
  ];

  const stats = [
    { icon: Globe, value: "10K+", label: "Active Farmers", color: "text-emerald-600" },
    { icon: MessageCircle, value: "50K+", label: "AI Queries Answered", color: "text-blue-600" },
    { icon: TrendingUp, value: "98%", label: "Accuracy Rate", color: "text-purple-600" },
    { icon: Award, value: "15+", label: "Crop Types Supported", color: "text-amber-600" },
  ];

  const testimonials = [
    {
      name: "Ravi Kumar",
      location: "Punjab, India",
      text: "Farm AI identified a fungal infection in my wheat crop before it spread. Saved my entire harvest.",
      stars: 5,
      crop: "Wheat Farmer"
    },
    {
      name: "Sarah Chen",
      location: "Iowa, USA",
      text: "The AI advisor gives region-specific advice — it knew about local soil conditions I didn't even ask about.",
      stars: 5,
      crop: "Soybean Farmer"
    },
    {
      name: "James Okafor",
      location: "Lagos, Nigeria",
      text: "Weather advisories helped me time my irrigation perfectly. Water usage down 30%.",
      stars: 5,
      crop: "Cassava Farmer"
    },
  ];

  const howItWorks = [
    { step: "01", icon: Sprout, title: "Create Your Profile", desc: "Sign up and set your location to get hyper-personalized farming advice." },
    { step: "02", icon: MessageCircle, title: "Ask Your AI Advisor", desc: "Type any farming question — disease, weather, planting, or market trends." },
    { step: "03", icon: Camera, title: "Scan Your Crops", desc: "Photograph any leaf or plant issue for instant AI disease diagnosis." },
    { step: "04", icon: BarChart3, title: "Monitor & Grow", desc: "Track history, weather, and community insights to maximize your yield." },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center rounded-3xl overflow-hidden mt-4 shadow-2xl">
        {/* Parallax Background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop&q=90"
            alt="Lush farmland at golden hour"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/85 to-green-800/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />
        </motion.div>

        {/* Decorative orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 px-8 py-20 md:py-28 lg:px-16 max-w-4xl"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div {...stagger(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-200 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 text-green-400" />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1 {...stagger(1)} className="text-5xl md:text-7xl text-white font-display leading-[1.05] tracking-tight">
            Farm Smarter.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Grow Better.
            </span>
          </motion.h1>

          <motion.p {...stagger(2)} className="mt-6 text-lg md:text-xl text-green-50/85 font-light max-w-2xl leading-relaxed">
            Farm AI is your always-on agricultural intelligence platform — delivering precision crop disease detection, real-time weather advisory, and AI-powered farming guidance for every farmer, everywhere.
          </motion.p>

          <motion.div {...stagger(3)} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/auth">
              <button id="hero-get-started-btn" className="group px-8 py-4 rounded-2xl font-semibold bg-white text-green-900 hover:bg-green-50 hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-black/30 flex items-center justify-center gap-2 text-lg">
                Start Farming Smarter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#features">
              <button id="hero-features-btn" className="px-8 py-4 rounded-2xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 text-lg">
                Explore Features
              </button>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div {...stagger(4)} className="mt-12 flex flex-wrap items-center gap-6">
            {["Free to Start", "No Credit Card Required", "AI-Powered"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-green-200/80 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#stats"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2 text-xs"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span>Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </section>

      {/* ── STATS SECTION ───────────────────────────────────────── */}
      <section id="stats" className="mt-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              {...stagger(i)}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
              className="glass-panel rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-current/10 mb-4 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className={`text-4xl font-display ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ────────────────────────────────────── */}
      <section id="features" className="mt-32">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Leaf className="w-4 h-4" /> Powerful AI Tools
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-foreground"
          >
            Everything You Need to <span className="text-primary">Grow</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Four powerful AI-driven tools built specifically for the challenges modern farmers face every day.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <Link href="/auth">
                <div id={`feature-card-${idx}`} className="glass-panel p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 group cursor-pointer h-full relative overflow-hidden">
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-t-3xl`} />

                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${feature.bg} ${feature.iconColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>

                  <div className={`mt-6 inline-flex items-center gap-2 ${feature.iconColor} font-medium text-sm group-hover:gap-3 transition-all`}>
                    Try it free <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="mt-32">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-foreground"
          >
            How Farm AI Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground text-lg"
          >
            Get started in minutes. No technical knowledge required.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

          {howItWorks.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative z-10 text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <step.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-5xl font-display text-primary/20 mb-2">{step.step}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="mt-32">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-foreground"
          >
            Loved by Farmers Worldwide
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-panel p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.crop} · {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FULL-WIDTH CTA BANNER ────────────────────────────────── */}
      <section className="mt-32 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=600&fit=crop&q=90"
            alt="Farmer in field"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 to-green-800/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl text-white font-display mb-4"
            >
              Ready to Transform Your Farm?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-green-100/80 text-lg mb-8 max-w-xl"
            >
              Join thousands of farmers already using Farm AI to increase yields, reduce losses, and farm smarter.
            </motion.p>
            <Link href="/auth">
              <button id="cta-signup-btn" className="group px-10 py-4 rounded-2xl font-semibold bg-white text-green-900 hover:bg-green-50 hover:-translate-y-1 transition-all duration-300 shadow-xl flex items-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
