const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// --- IMAGE UPLOAD SETUP ---
app.use("/uploads", express.static("uploads"));
if (!fs.existsSync("./uploads")) { fs.mkdirSync("./uploads"); }

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// --- MONGODB CONNECTION ---
mongoose.connect("mongodb://127.0.0.1:27017/gadgethub")
  .then(() => console.log("MongoDB Connected Successfully ✅"))
  .catch((err) => console.log("MongoDB Connection Error ❌:", err));

// --- SCHEMAS & MODELS ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "customer" } // NEW: Role-based access
});
const User = mongoose.model("User", UserSchema);

const ProductSchema = new mongoose.Schema({
  name: String, price: Number, image: String, category: String,
});
const Product = mongoose.model("Product", ProductSchema);

const CartSchema = new mongoose.Schema({
  userId: String, userName: String, productId: String, name: String, price: Number, image: String, quantity: { type: Number, default: 1 },
});
const Cart = mongoose.model("Cart", CartSchema);

const OrderSchema = new mongoose.Schema({
  userId: String, userName: String, products: Array, total: Number, createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", OrderSchema);

// --- AUTHENTICATION ---
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Secret logic: This specific email automatically becomes the Master Admin
    // Change "ibrahim@gadgethub.com" to "admin@gadgethub.com"
const role = email === "admin@gadgethub.com" ? "admin" : "customer";
    
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    res.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMIN ORDER ROUTE (NEW) ---
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Newest first
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PRODUCT ROUTES ---
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(p => ({ id: p._id, name: p.name, price: p.price, image: p.image, category: p.category })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "";
    const newProduct = new Product({ name, price, image: imageUrl, category });
    await newProduct.save();
    res.json({ success: true, message: "Product Added", product: { id: newProduct._id, name: newProduct.name, price: newProduct.price, image: newProduct.image, category: newProduct.category }});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// NEW: EDIT PRODUCT ROUTE
app.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    let updateData = { name, price, category };
    
    // Only update the image if a new file was actually uploaded
    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: "Product Updated", product: { id: updated._id, name: updated.name, price: updated.price, image: updated.image, category: updated.category }});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CART & CHECKOUT ROUTES ---
app.post("/cart", async (req, res) => {
  try {
    const { userId, userName, productId, name, price, image } = req.body;
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.json({ success: true, message: "Quantity Updated" });
    }
    const cartItem = new Cart({ userId, userName, productId, name, price, image, quantity: 1 });
    await cartItem.save();
    res.json({ success: true, message: "Added To Cart" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/cart/:userId", async (req, res) => {
  try {
    res.json(await Cart.find({ userId: req.params.userId }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/checkout", async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const cartItems = await Cart.find({ userId });
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = new Order({ userId, userName, products: cartItems, total });
    await order.save();
    await Cart.deleteMany({ userId });
    res.json({ success: true, message: "Checkout Successful" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(5000, () => console.log("Server running on port 5000 🚀"));