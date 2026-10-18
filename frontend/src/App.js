import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import AdminDashboard from "./components/AdminDashboard";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

const CATEGORIES = ["All", "Smartphones", "Laptops", "Audio", "Wearables", "Gaming"];

export default function App() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        
        setTimeout(() => {
          setProducts(data);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Failed to load products");
        setIsLoading(false);
      }
    };
    fetchProducts();

    const savedUser = localStorage.getItem("gadgethub-user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      loadCart(parsed.id);
    }
  }, []);

  // --- CART LOGIC ---
  const loadCart = async (userId) => {
    const res = await fetch(`http://localhost:5000/cart/${userId}`);
    const data = await res.json();
    setCartItems(data);
  };

  const addToCart = async (product) => {
    if (!user) return setShowSignup(true);

    await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        userName: user.name,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }),
    });

    loadCart(user.id);
    showToast(`${product.name} added to cart`);
  };

  const checkout = async () => {
    if (!user) return;
    await fetch("http://localhost:5000/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, userName: user.name }),
    });
    
    setCartItems([]);
    setIsCartOpen(false);
    showToast("Checkout Successful ✅");
  };

  // --- AUTHENTICATION LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem("gadgethub-user");
    setUser(null);
    setCartItems([]); 
    setIsCartOpen(false);
    showToast("Logged out successfully 👋");
  };

  // --- UTILS ---
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  // --- ADVANCED FILTERING & SORTING ENGINE ---
  let processedProducts = [...products];

  if (search) {
    processedProducts = processedProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (activeCategory !== "All") {
    processedProducts = processedProducts.filter(
      (product) => product.category === activeCategory
    );
  }

  if (sortBy === "lowToHigh") {
    processedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "highToLow") {
    processedProducts.sort((a, b) => b.price - a.price);
  }

  // --- SKELETON LOADING COMPONENT ---
  const SkeletonCard = () => (
    <div className="animate-pulse space-y-4">
      <div className="w-full h-72 bg-white/5 rounded-[30px] border border-white/5"></div>
      <div className="space-y-2 px-2">
        <div className="h-5 bg-white/10 rounded-md w-3/4"></div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-white/5 rounded-md w-1/4"></div>
          <div className="h-4 bg-white/10 rounded-md w-1/5"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-white selection:text-black relative flex flex-col">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full z-[100] shadow-2xl font-semibold text-sm tracking-wide"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAYS & MODALS */}
      {isAdminView && <AdminDashboard products={products} setProducts={setProducts} showToast={showToast} onClose={() => setIsAdminView(false)} />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} checkout={checkout} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} setUser={setUser} showToast={showToast} loadCart={loadCart} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} setUser={setUser} showToast={showToast} />}

      {/* NAVIGATION BAR */}
      <nav className="flex items-center justify-between px-8 md:px-24 py-8 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-30 border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-tighter">GadgetHub.</h1>
        <div className="flex items-center gap-6 text-sm font-medium">
          
          {/* Universal Entrance: Anyone can click, but it prompts an explicit login check */}
          <button onClick={() => setIsAdminView(true)} className="text-gray-500 hover:text-white transition-colors">
            Admin Portal
          </button>
          
          {user ? (
            <div className="flex items-center gap-6">
              <span className="text-gray-400 hidden sm:inline">Hello, {user.name}</span>
              <button onClick={() => setIsCartOpen(true)} className="hover:text-white transition-colors">
                Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
              </button>
              
              <button 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-300 font-semibold transition-colors border border-red-400/20 bg-red-400/10 px-4 py-2 rounded-full text-xs"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="text-gray-400 hover:text-white transition-colors">Log In</button>
              <button onClick={() => setShowSignup(true)} className="bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* PREMIUM HERO SECTION */}
      <div className="relative w-full h-[70vh] md:h-[85vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center px-8 flex flex-col items-center w-full max-w-4xl mx-auto mt-[-5vh]">
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex flex-col items-center"
          >
            
            
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-bold tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              Nothing but <br /> essential.
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light">
              Experience technology designed to get out of your way. Discover our curated collection of matte, transparent, and industrial-grade gadgets.
            </p>
            
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Explore Devices
            </button>
          </motion.div>
        </div>
      </div>

      {/* HEADER & SEARCH */}
      <header className="px-8 md:px-24 pt-16 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Discover the <br/><span className="text-gray-500">future of tech.</span>
          </h2>
        </div>
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 bg-transparent border-b border-white/20 pb-2 text-lg outline-none focus:border-white transition-colors placeholder:text-gray-600"
        />
      </header>

      {/* FILTER & SORT BAR */}
      <div className="px-8 md:px-24 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Custom scrollbar applied here */}
        <div className="flex items-center gap-3 overflow-x-auto w-full pb-4 md:pb-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-[#111] text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="shrink-0">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-white/10 text-white text-sm rounded-full px-5 py-2.5 outline-none focus:border-white transition-colors cursor-pointer appearance-none"
          >
            <option value="default" className="bg-[#111]">Sort by: Featured</option>
            <option value="lowToHigh" className="bg-[#111]">Price: Low to High</option>
            <option value="highToLow" className="bg-[#111]">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        {/* PRODUCT GRID SECTION */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 px-8 md:px-24 pb-32">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
          ) : processedProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              No products found matching your criteria.
            </div>
          ) : (
            processedProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))
          )}
        </div>
      </main>

      {/* PREMIUM FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] pt-20 pb-10 px-8 md:px-24 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">GadgetHub.</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              The premium destination for your tech lifestyle. Delivering the future, today.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Smartphones</li>
              <li className="hover:text-white cursor-pointer transition-colors">Laptops</li>
              <li className="hover:text-white cursor-pointer transition-colors">Audio</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Shipping Info</li>
              <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} GadgetHub. All rights reserved.</p>
          <p>Designed for the future.</p>
        </div>
      </footer>

    </div>
  );
}