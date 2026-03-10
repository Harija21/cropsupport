import { useState } from "react";
import { useCommunityPosts, useCreatePost } from "@/hooks/use-community";
import { format } from "date-fns";
import { MessageCircle, Users, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Community() {
  const { data: posts, isLoading } = useCommunityPosts();
  const createPostMutation = useCreatePost();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    await createPostMutation.mutateAsync(formData);
    setFormData({ title: "", content: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display text-foreground">Farmer Community</h1>
          <p className="text-muted-foreground text-lg mt-2">Share knowledge, ask for advice, and connect with peers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-2 border-border bg-white/50">
          <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">No posts yet</h3>
          <p className="text-muted-foreground mt-2">Be the first to start a conversation in the community!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts?.map((post) => (
            <motion.div 
              key={post.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 md:p-8 rounded-3xl hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <h2 className="text-2xl font-bold text-foreground">{post.title}</h2>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{post.authorName}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(post.createdAt!), 'MMMM d, yyyy')}</div>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/5">
                  <MessageCircle className="w-5 h-5" /> Reply
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-background rounded-3xl shadow-2xl p-8 overflow-hidden border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create a Post</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Discussion Topic</label>
                  <input 
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="E.g., Best organic fertilizers for tomatoes?"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-border/50 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Details</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Describe your situation, share a tip, or ask a question..."
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-border/50 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                
                {createPostMutation.error && (
                  <p className="text-sm text-destructive font-medium">{createPostMutation.error.message}</p>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createPostMutation.isPending}
                    className="px-8 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {createPostMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Publish Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
