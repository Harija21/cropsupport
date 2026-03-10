import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldAlert, CloudSun, Users } from "lucide-react";
import { useUser } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function Home() {
  const { data: user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel mt-4 border-none shadow-2xl">
        {/* landing page hero scenic mountain landscape */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop" 
            alt="Beautiful farmland" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 px-8 py-24 md:py-32 lg:px-16 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl text-white font-display leading-tight"
          >
            Cultivating the Future of <span className="text-green-300">Smart Farming</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-green-50/90 font-light max-w-xl text-balance"
          >
            Empower your agricultural journey with AI-driven insights, real-time crop disease detection, and a thriving farmer community.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/auth">
              <button className="px-8 py-4 rounded-xl font-semibold bg-white text-green-900 hover:bg-green-50 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display text-foreground">Everything You Need to Grow</h2>
          <p className="mt-4 text-muted-foreground text-lg">Powerful tools designed specifically for modern agriculture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Leaf,
              title: "AI Agronomist",
              desc: "Get instant, expert answers to your farming questions 24/7.",
              color: "bg-emerald-100 text-emerald-700"
            },
            {
              icon: ShieldAlert,
              title: "Disease Detection",
              desc: "Upload a leaf photo and let AI diagnose crop diseases instantly.",
              color: "bg-rose-100 text-rose-700"
            },
            {
              icon: CloudSun,
              title: "Smart Weather",
              desc: "Micro-climate insights tailored to your specific farming location.",
              color: "bg-sky-100 text-sky-700"
            },
            {
              icon: Users,
              title: "Farmer Network",
              desc: "Connect, share tips, and trade with local farmers in your area.",
              color: "bg-amber-100 text-amber-700"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
