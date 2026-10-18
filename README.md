# GadgetHub 🛒

A full-stack electronics e-commerce web application built using React.js, Node.js, Express.js, and MongoDB. GadgetHub provides a platform for browsing products, managing shopping carts, user authentication, and product administration.

## ✨ Features

- **Product Browsing** — View and explore electronics and gadgets.
- **User Authentication** — User registration and login.
- **Shopping Cart** — Add and manage products in the cart.
- **Admin Dashboard** — Manage products through an administrative interface.
- **Database Integration** — Store and retrieve application data using MongoDB.
- **Product Image Uploads** — Store and serve product images.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB

### Development Tools
- Git
- GitHub
- MongoDB Compass
- npm

## 📁 Project Structure

```text
GadgetHub/
├── backend/
│   ├── uploads/
│   ├── package.json
│   ├── package-lock.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run GadgetHub on your local machine.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/shaadanakthar/GadgetHub.git
cd GadgetHub
```

### 2. Set Up the Backend

Open a terminal in the project directory and run:

```bash
cd backend
npm install
```

Configure the required environment variables for your MongoDB connection and any other backend settings. Do not commit passwords, API keys, or other secrets.

Start the backend using the command defined in `backend/package.json`. For example, if the project uses a `start` script:

```bash
npm start
```

### 3. Set Up the Frontend

Open a second terminal in the project directory and run:

```bash
cd frontend
npm install
npm start
```

The React development server will display the local URL where you can access the application.

## ⚙️ Configuration

Configure the MongoDB connection and other required settings before running the backend.

If your application uses a `.env` file, create it locally using the variable names expected by your backend code. Never upload real credentials to GitHub.

## 🔮 Future Improvements

- Online payment gateway integration
- Product search, filtering, and sorting enhancements
- Order history and order tracking
- Improved responsive design
- Deployment to a cloud hosting platform

## 👨‍💻 Author

**Shaadan Akthar**

GitHub: [@shaadanakthar](https://github.com/shaadanakthar)

---

*Developed as a full-stack web development project.*