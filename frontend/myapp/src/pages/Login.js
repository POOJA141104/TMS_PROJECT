import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const apiBase = process.env.REACT_APP_API_BASE_URL || "/api";
      const res = await axios.post(`${apiBase}/login`, {
        email,
        password
      });

      const role = res.data.role;

      if (role === "admin") navigate("/admin");
      else if (role === "superadmin") navigate("/superadmin");
      else navigate("/user");

    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ marginTop: "100px", textAlign: "center" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
