import { useEffect, useState } from 'react';
import api from '../services/api';
import bgImage from '../assets/bg.jpg';

export default function UserDashboard() {
  const [polls, setPolls] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');

  const fetchPolls = async () => {
    try {
      const res = await api.get('/polls/available'); // This must be correct
      setPolls(res.data); // This must receive the filtered polls
    } catch (err) {
      console.error('Failed to fetch polls:', err);
    }
  };


  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionIndex }); // pass index
      fetchPolls();
    } catch (err) {
      alert(err.response?.data?.error || 'Vote failed');
    }
  };



  useEffect(() => {
    api.get('/users/me').then(res => {
      setCurrentUserId(res.data._id);
      fetchPolls();
    });
  }, []);


  return (
    <div className="p-10 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <h2 className="text-2xl font-bold mb-4">Available Polls 📊</h2>
      {polls.length === 0 ? (
        <p>No available polls</p>
      ) : (
        polls.map(poll => (
          <div key={poll._id} className='flex flex-col'>
            <h3 className='font-medium  mt-8'><span className='text-gray-700'>Title: </span>{poll.title}</h3>
            {poll.options?.map((opt, i) => {
              const votesForOption = poll.votes?.filter(v => v.optionIndex === i).length || 0;
              const isVoted = poll.votes?.find(v => v.userId === currentUserId)?.optionIndex === i;

              const expired = new Date(poll.expiresAt) < new Date(); // Add this if not defined above

              return (
                <div key={i} className={` rounded ${isVoted ? 'bg-green-100' : ''} flex justify-between w-3/4`}>
                  <div className="flex justify-between w-1/2">
                    <span>{opt.text}</span>
                    <span>{votesForOption} votes</span>
                  </div>
                  {!expired && !poll.votes?.some(v => v.userId === currentUserId) && (
                    <div className="flex items-center text-center">
                      <button
                        className="text-blue-800 text-sm px-2 py-1 underline cursor-pointer font-medium text-center"
                        onClick={() => handleVote(poll._id, i)}
                      >
                        vote
                      </button></div>
                  )}
                  {isVoted && <span className="text-green-800 text-sm">✅ You voted</span>}
                </div>
              );
            })}

          </div>
        ))
      )}

    </div>
  );
}
