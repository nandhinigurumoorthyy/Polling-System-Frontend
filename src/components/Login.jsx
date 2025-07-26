import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Link} from "react-router-dom";
import pollgif from '../assets/poll.gif'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate(`/${res.data.role}`);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className='h-screen flex items-center p-10'>

<div className='mx-auto'>
  <h1 className='text-2xl font-medium'>Polling System</h1>
  <p className='text-gray-400'>No meetings, just meaningful clicks....</p>
  <img src={pollgif} alt="poll gif" />
</div>


    <form onSubmit={handleLogin} className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-2 border" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer">Login</button>

       {/* Sign up Link */}
          <div className="flex lg:flex-row md:flex-row flex-col justify-center items-center gap-2 mt-3 pt-2  text-sm sm:text-base">
            <p className="text-gray-500 text-xl">Don't have an account?</p>
            <Link
              to="/register"
              className="cursor-pointer text-lg font-medium text-green-900 flex gap-2 items-center no-underline justify-center py-1 px-3 transition-all duration-300"
            >
              Sign up
            </Link>
          </div>

    </form></div>
  );
}