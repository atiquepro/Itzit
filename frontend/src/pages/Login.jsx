import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="h-screen bg-white">
  <div className="flex justify-center items-center h-full bg-gradient-to-br from-purple-500 to-pink-500">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/2 rounded-lg bg-purple-500 p-3 text-black transition hover:bg-purple-600"
          >
            Log In
          </button>
        </div>
      </form>
      <div className="my-4 text-center text-sm text-gray-500">or</div>
      <button
        onClick={loginWithGoogle}
        className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 transition hover:bg-gray-100"
      >
        Continue with Google
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="signup" className="text-purple-500 hover:underline">Sign up</a>
      </p>
    </div>
  </div>
</div>

  );
};

export default Login;
