import { motion } from "framer-motion";
import { useState } from "react";

export default function SignupModal({ onClose, setUser, showToast }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    const data = await res.json();
    
    if (data.success) {
      localStorage.setItem("gadgethub-user", JSON.stringify(data.user));
      setUser(data.user);
      onClose();
      showToast(`Welcome to GadgetHub, ${data.user.name}! 🎉`);
    } else {
      showToast(data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[30px] w-full max-w-md shadow-2xl relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">✕</button>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors"
            required
          />
          <button className="w-full py-4 mt-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
            Join Now
          </button>
        </form>
      </motion.div>
    </div>
  );
}