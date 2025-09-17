import { useState, useEffect } from 'react';
import axios from 'axios';

function Demo() {
  const [user, setUser] = useState(null);       // state to store user data
  const [loading, setLoading] = useState(true); // state for loading indicator
  const [error, setError] = useState(null);     // state for error handling
  
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
        setUser(response.data);   // update state with user data
      } catch (err) {
        setError(err.message);    // store error message
      } finally {
        setLoading(false);        // stop loading after request finishes
      }
    };
    
    fetchUser();
  }, []); // empty array = run once on mount
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
    </div>
  );
}

export default Demo;
