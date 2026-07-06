
import { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/login`)
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <p>Loading...</p>;

 return(
  <div className="h-screen bg-slate-400">{JSON.stringify(user)}</div>
 )
}

export default Login
