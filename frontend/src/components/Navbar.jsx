export default function Navbar({ cartCount, user, setShowLogin, setShowSignup }) {
  return (
    <nav className="flex items-center justify-between px-8 md:px-20 py-6 border-b border-white/10">
      <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        GadgetHub
      </h1>

      <div className="flex items-center gap-5">
        <div className="text-lg">Cart ({cartCount})</div>

        {user ? (
          <div className="px-5 py-2 rounded-xl bg-white/10">
            Welcome {user.name}
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 rounded-xl border border-white/10"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}