import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer({ isOpen, onClose, cartItems, checkout }) {
  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-50 flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Your Cart</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">Your cart is empty.</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            {/* Total & Checkout Section */}
            {cartItems.length > 0 && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex justify-between items-center mb-6 text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={checkout}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                >
                  Checkout Securely
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}