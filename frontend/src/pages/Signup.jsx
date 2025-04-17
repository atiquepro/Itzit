import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/signup', {
                name,
                email,
                password,
                role: 'user',
                secretKey: '',
            });

            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error signing up');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-500  via-purple-500 to-pink-400">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-1/2 rounded-lg bg-blue-500 p-3 text-black transition hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
