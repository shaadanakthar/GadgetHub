import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard({ products, setProducts, showToast, onClose }) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [orders, setOrders] = useState([]);
  
  // Form State (Handles both Add & Edit)
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Smartphones" });
  const [imageFile, setImageFile] = useState(null);

  // Fetch Orders on Load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/orders");
        setOrders(await res.json());
      } catch (err) { console.error("Failed to fetch orders"); }
    };
    fetchOrders();
  }, []);

  // Analytics Calculations
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalItemsSold = orders.reduce((acc, order) => acc + order.products.reduce((sum, p) => sum + p.quantity, 0), 0);

  // --- PRODUCT SUBMIT HANDLER (POST OR PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !editingId) return showToast("Please select an image! 📸");

    try {
      showToast(editingId ? "Updating product..." : "Publishing product...");
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      if (imageFile) formData.append("image", imageFile); 

      const url = editingId ? `http://localhost:5000/products/${editingId}` : "http://localhost:5000/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      
      if (data.success) {
        if (editingId) {
          setProducts(products.map(p => p.id === editingId ? data.product : p));
        } else {
          setProducts([...products, data.product]);
        }
        showToast("✅ " + data.message);
        resetForm();
      } else {
        showToast(`❌ Error: ${data.message}`);
      }
    } catch (error) { showToast("🚨 Network Error!"); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
        showToast("🗑️ " + data.message);
      }
    } catch (error) { showToast("🚨 Failed to delete product."); }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({ name: product.name, price: product.price, category: product.category });
    setActiveTab("inventory");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setNewProduct({ name: "", price: "", category: "Smartphones" });
    setImageFile(null);
    if (document.getElementById("fileInput")) document.getElementById("fileInput").value = ""; 
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-[#050505] text-[#ededed] p-8 md:p-16 absolute inset-0 z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter">Command Center</h2>
            <p className="text-gray-500 mt-2">Manage your inventory, track revenue, and monitor orders.</p>
          </div>
          <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium">
            Exit Dashboard
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-10">
          {["analytics", "inventory", "orders"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl capitalize font-semibold transition-all ${activeTab === tab ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- ANALYTICS TAB --- */}
        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-[30px] border border-white/5">
              <p className="text-gray-400 mb-2 font-medium">Total Revenue</p>
              <h3 className="text-5xl font-bold tracking-tighter text-emerald-400">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-white/5 p-8 rounded-[30px] border border-white/5">
              <p className="text-gray-400 mb-2 font-medium">Total Orders</p>
              <h3 className="text-5xl font-bold tracking-tighter">{orders.length}</h3>
            </div>
            <div className="bg-white/5 p-8 rounded-[30px] border border-white/5">
              <p className="text-gray-400 mb-2 font-medium">Active Products</p>
              <h3 className="text-5xl font-bold tracking-tighter">{products.length}</h3>
            </div>
          </div>
        )}

        {/* --- INVENTORY TAB --- */}
        {activeTab === "inventory" && (
          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* Form */}
            <div className="lg:col-span-2 bg-white/5 p-8 rounded-[30px] border border-white/5 h-fit sticky top-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{editingId ? "Edit Product" : "Add Product"}</h3>
                {editingId && <button onClick={resetForm} className="text-xs text-red-400 hover:text-red-300">Cancel Edit</button>}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors" required />
                <input type="number" placeholder="Price (₹)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors" required />
                <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" required={!editingId} />
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none focus:border-white transition-colors text-white cursor-pointer">
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Gaming">Gaming</option>
                </select>
                <button type="submit" className={`w-full py-4 rounded-xl font-bold transition-colors mt-4 text-black ${editingId ? "bg-emerald-400 hover:bg-emerald-500" : "bg-white hover:bg-gray-200"}`}>
                  {editingId ? "Save Changes" : "Publish Product"}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-2xl font-bold mb-6">Current Stock</h3>
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover bg-black" />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{product.name}</h4>
                    <p className="text-emerald-400 font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleEditClick(product)} className="text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-sm text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === "orders" && (
          <div className="bg-white/5 rounded-[30px] border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="p-6 text-gray-400 font-medium text-sm">Order ID</th>
                  <th className="p-6 text-gray-400 font-medium text-sm">Customer</th>
                  <th className="p-6 text-gray-400 font-medium text-sm">Date</th>
                  <th className="p-6 text-gray-400 font-medium text-sm text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 text-sm font-mono text-gray-500">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-6 font-medium">{order.userName}</td>
                    <td className="p-6 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-6 font-bold text-emerald-400 text-right">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </motion.div>
  );
}