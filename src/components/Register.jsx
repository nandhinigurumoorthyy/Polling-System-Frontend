import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Link} from "react-router-dom";
import pollgif from '../assets/poll.gif'

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
     await api.post('/auth/register', { username, email, password, role });
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (

        <div className='h-screen flex items-center p-10'>
    
    <div className='mx-auto'>
      <h1 className='text-2xl font-medium'>Polling System</h1>
      <p className='text-gray-400'>No meetings, just meaningful clicks....</p>
      <img src={pollgif} alt="poll gif" />
    </div>

    <form onSubmit={handleRegister} className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Register</h2>
      <input
  type="text"
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="w-full p-2 mb-2 border"
  required
/>

      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-2 border" />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 mb-2 border">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="bg-green-800 text-white px-4 py-2">Register</button>

      {/* Login Link */}
          <div className="flex lg:flex-row md:flex-row flex-col justify-center items-center gap-2 mt-3 pt-2  text-sm sm:text-base">
            <p className="text-gray-500 text-xl">Don't have an account?</p>
            <Link
              to="/"
              className="cursor-pointer text-lg font-medium text-blue-800 flex gap-2 items-center no-underline justify-center py-1 px-3 transition-all duration-300"
            >Log In
            </Link>
          </div>
    </form>

    
    </div>
  );
}
