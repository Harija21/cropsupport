import { useState, useRef } from "react";
import { useDetectDisease, useDiseaseHistory } from "@/hooks/use-disease";
import { UploadCloud, Image as ImageIcon, CheckCircle2, Loader2, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function DiseaseDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const detectMutation = useDetectDisease();
  const { data: history, isLoading } = useDiseaseHistory();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await detectMutation.mutateAsync(file);
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      // Error handled by mutation
    }
  };

  const triggerSelect = () => fileInputRef.current?.click();

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-display text-foreground">Crop Disease Detection</h1>
        <p className="text-muted-foreground text-lg mt-2">Upload a photo of an affected leaf for instant AI diagnosis and treatment advice.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-6">New Scan</h2>
          
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={triggerSelect}
                  className="border-2 border-dashed border-primary/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-colors bg-white/50"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <UploadCloud className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Click to Upload</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">Supports JPG, PNG, WEBP. Ensure the leaf is clearly visible and well-lit.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl overflow-hidden relative border border-border shadow-lg"
                >
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <div className="flex gap-3">
                      <button 
                        onClick={triggerSelect}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <RefreshCcw className="w-4 h-4" /> Change Image
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />

            <button
              onClick={handleUpload}
              disabled={!file || detectMutation.isPending}
              className="w-full mt-8 px-6 py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {detectMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image...</>
              ) : (
                <><ImageIcon className="w-5 h-5" /> Analyze Crop</>
              )}
            </button>
            
            {detectMutation.error && (
              <p className="mt-4 text-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {detectMutation.error.message}
              </p>
            )}
          </div>
        </div>

        {/* Latest Result / Hero Graphic */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col">
          {detectMutation.isSuccess && detectMutation.data ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 text-emerald-600 mb-6 bg-emerald-50 w-fit px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Analysis Complete</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Diagnosis</h3>
                  <p className="text-3xl font-display text-foreground text-balance">{detectMutation.data.prediction}</p>
                </div>
                
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Recommended Action</h3>
                  <p className="text-foreground leading-relaxed text-balance">{detectMutation.data.advice}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full relative min-h-[400px]">
              {/* landing page farmer tech */}
              <img 
                src="https://pixabay.com/get/g3179cf0bb32dd47e86ed5244f35e603e64c8168f7eded3e9e74c03f5cdda894cc4e8d6c2cf0fa1a14287c4ed55c329d1c5274bd5c3d24c8dcef1e514130ee3b8_1280.jpg" 
                alt="Agricultural technology" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-900/60 backdrop-blur-[2px] p-12 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-display mb-3">Early detection saves yields.</h3>
                <p className="text-white/80">Upload a clear picture of the affected area to get a precise diagnosis powered by trained agronomic AI models.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Scan History</h2>
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : history?.length === 0 ? (
          <div className="text-center p-12 bg-white/50 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">No scans yet. Upload your first image to see history.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {history?.map((report) => (
              <div key={report.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={report.imageUrl} alt="Crop scan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {format(new Date(report.createdAt!), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-2 truncate">{report.prediction}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{report.advice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
