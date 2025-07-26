import { useEffect, useState } from 'react';
import api from '../services/api';
import bgImage from '../assets/bg.jpg';
import { useRef } from 'react';


export default function AdminDashboard() {
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [visibility, setVisibility] = useState('public');
  const [allUsers, setAllUsers] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [expiresInMinutes, setExpiresInMinutes] = useState('');
  const [editingPollId, setEditingPollId] = useState(null);
const formRef = useRef(null);

  useEffect(() => {
    fetchPolls();
    fetchUsers();
  }, []);



  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // assumes this returns all users
      setAllUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };
  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionIndex });
      fetchPolls(); // refresh results
    } catch (err) {
      alert(err.response?.data?.error || 'Vote failed');
      console.error(err);
    }
  };


  const fetchPolls = async () => {
    const res = await api.get('/polls/my');
    setPolls(res.data);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      options: options
        .filter(opt => opt.trim() !== '')
        .map(text => ({ text })),
      visibility,
      allowedUsers,
    };

    if (!editingPollId) {
      payload.expiresInMinutes = Number(expiresInMinutes); // only for creation
    }

    try {
      if (editingPollId) {
        // Edit mode
        await api.put(`/polls/${editingPollId}`, payload);
      } else {
        // Create mode
        await api.post('/polls', payload);
      }

      // Reset form
      setTitle('');
      setOptions(['', '']);
      setVisibility('public');
      setAllowedUsers([]);
      setExpiresInMinutes('');
      setEditingPollId(null); // reset edit mode
      setShowCreate(false);
      fetchPolls();
    } catch (err) {
      alert(editingPollId ? 'Poll update failed' : 'Poll creation failed');
      console.error(err);
    }
  };


  const handleEdit = (poll) => {
    setShowCreate(true); // reuse the create form
    setTitle(poll.title);
    setOptions(poll.options.map(opt => opt.text)); // convert from [{text}] to ['text']
    setVisibility(poll.visibility);
    setAllowedUsers(poll.allowedUsers);
    setEditingPollId(poll._id); // create this state

      setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? 📊')) return;
    try {
      await api.delete(`/polls/${pollId}`);
      fetchPolls(); // refresh
    } catch (err) {
      alert('Delete failed');
      console.error(err);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-cover bg-center bg-no-repeat"   style={{ backgroundImage: `url(${bgImage})` }}>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard 📊</h2>

      <button
        onClick={() => setShowCreate(!showCreate)}
        className="bg-green-600 text-white px-4 py-2 mb-4 rounded cursor-pointer"
      >
        {showCreate ? 'Cancel' : '+ Create Poll'}
      </button>

      {showCreate && (
        <form onSubmit={handleCreatePoll} ref={formRef} className="border p-4 mb-6 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-2">🖋️ Poll</h3>

          <input
            type="text"
            placeholder="Poll Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 mb-2"
          />

          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[idx] = e.target.value;
                  setOptions(newOpts);
                }}
                className="w-full border p-2"
                required
              />
              {idx > 1 && (
                <button
                  type="button"
                  onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                  className="text-red-600"
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setOptions([...options, ''])}
            className="text-blue-600 underline mb-2"
          >
            + Add Option
          </button>

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full border p-2 mb-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {visibility === 'private' && (
            <div className="mb-4">
              <label className="block font-medium mb-2">Allowed Users</label>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                {allUsers.map((user) => (
                  <label key={user._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={user._id}
                      checked={allowedUsers.includes(user._id)}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (e.target.checked) {
                          setAllowedUsers([...allowedUsers, id]);
                        } else {
                          setAllowedUsers(allowedUsers.filter((uid) => uid !== id));
                        }
                      }}
                    />
                    <span>{user.username}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <input
            type="number"
            placeholder="Expires in (minutes)"
            value={expiresInMinutes}
            onChange={(e) => setExpiresInMinutes(e.target.value)}
            required
            min="1"
            max="120"
            className="w-full border p-2 mb-2"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            ✅ Create Poll
          </button>
        </form>
      )}
      <div className='flex gap-16 justify-around'>
<div>
 {polls.map((poll) => {
  const isActive = new Date(poll.expiresAt) > new Date();
  const totalVotes = poll.votes?.length || 0;
  const optionVoteCounts = poll.options.map(
    (_, i) => poll.votes?.filter((v) => v.optionIndex === i).length || 0
  );

  return (
    <div key={poll._id} className="p-4 mb-4 rounded">
      <h3 className="text-lg font-semibold">{poll.title}</h3>
      <p className="mb-2">Status: {isActive ? '🟢 Active' : '🔴 Expired'}</p>
      <p className="mt-2 font-medium">Total Votes: {totalVotes}</p>

      <ul className="list-disc list-inside mb-3">
        {poll.options.map((opt, idx) => (
          <li key={idx}>
            {opt.text} — {optionVoteCounts[idx]} vote(s)
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        {isActive && (
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={() => handleEdit(poll)}
          >
            ✏️ Edit
          </button>
        )}
        <button
          className="text-red-600 underline cursor-pointer"
          onClick={() => handleDelete(poll._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
})}
</div>





<div className='flex flex-col'>



      {polls.map((poll) => {
        const isActive = new Date(poll.expiresAt) > new Date();
        const totalVotes = poll.votes?.length || 0;
        const optionVoteCounts = poll.options.map(
          (_, i) => poll.votes?.filter((v) => v.optionIndex === i).length || 0
        );


        return (
          <div key={poll._id} className="p-4 mb-4 rounded mt-5">
            <h3 className="text-lg font-semibold">{poll.title}</h3>
            <p className="mb-2">Status: {isActive ? '🟢 Active' : '🔴 Expired'}</p>
            <p className="mt-2 font-medium">Total Votes: {totalVotes}</p>

            {poll.options.map((opt, idx) => (
              <div key={idx} className="flex justify-between items-center mb-1 gap-5">
                <span>{opt.text}</span>
                <span>{optionVoteCounts[idx]} votes</span>
                {isActive && (
                  <button
                    className="text-blue-600 underline text-sm ml-4 cursor-pointer"
                    onClick={() => handleVote(poll._id, idx)} // pass index
                  >
                    Vote
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      })}

    </div></div></div>
  );
}
