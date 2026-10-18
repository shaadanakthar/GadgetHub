import { motion } from "framer-motion";
import { useState } from "react";

export default function ProductCard({ product, addToCart }) {
  // Simple state to track if the heart is clicked
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white/5 border border-white/5 rounded-[30px] overflow-hidden hover:border-white/20 transition-colors relative flex flex-col h-full"
    >
      {/* 1. THE HEART BUTTON (WISHLIST) */}
      <button 
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={isLiked ? "#ef4444" : "none"} // Fills red if liked
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke={isLiked ? "#ef4444" : "currentColor"} 
          className="w-5 h-5 transition-colors duration-300"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      {/* 2. PREMIUM IMAGE HOVER ZOOM */}
      <div className="overflow-hidden h-72 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {product.category}
          </p>
          <h2 className="text-2xl font-bold mb-6 line-clamp-2">
            {product.name}
          </h2>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-medium tracking-tight">
            ₹{product.price.toLocaleString()}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}