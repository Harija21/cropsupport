import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sprout, Loader2 } from "lucide-react";
import { useLogin, useRegister } from "@/hooks/use-auth";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    location: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginMutation.mutateAsync({ username: formData.username, password: formData.password });
      } else {
        await registerMutation.mutateAsync(formData);
      }
      setLocation("/dashboard");
    } catch (error) {
      // Error handled by mutation state
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;
  const error = loginMutation.error || registerMutation.error;

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-card rounded-[2rem] overflow-hidden shadow-2xl shadow-green-900/10 border border-border/50">
        
        {/* Form Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-primary mb-8">
            <Sprout className="w-8 h-8" />
            <span className="font-display text-2xl tracking-wide">AgriConnect</span>
          </div>

          <h2 className="text-3xl font-display text-foreground mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isLogin ? "Enter your details to access your farm dashboard." : "Join the modern farming community today."}
          </p>

          {error && (
            <div className="p-4 mb-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Farm Location</label>
                  <input 
                    required
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                    placeholder="Nairobi, Kenya"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <input 
                required
                type="text"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-4 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setFormData({ username: '', password: '', name: '', location: '' }); }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Register now" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Image Side */}
        <div className="hidden lg:block relative">
          {/* landing page farmer in field */}
          <img 
            src="https://pixabay.com/get/g7d61fefbfca8c1e1f1dcf331ccd333be8ae041dee2e58d18b7321742a4f0ccb2dce30488a6ce893a8a75f7e0bc8f2cfa453638ffd09c03b952f6c93b971105f1_1280.jpg" 
            alt="Farmer in field" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/40 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h3 className="text-3xl font-display mb-4">"Technology is the new tractor."</h3>
            <p className="text-white/80 text-lg">Join thousands of farmers using AgriConnect to improve their yield and connect with experts globally.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
