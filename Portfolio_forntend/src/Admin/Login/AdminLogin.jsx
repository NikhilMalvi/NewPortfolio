import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { axios, setToken } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/admin/logIn", {
        email,
        password,
      });

      if (!data.success) {
        return toast.error(data.message);
      }

      // Store token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Send token for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      toast.success("Login successful!");
      navigate("/admin/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <section className="loginWrapper">
      <div className="loginCard">
        <h1 className="loginTitle">Admin Login</h1>
        <p className="loginSubtitle">
          Sign in to manage your portfolio dashboard.
        </p>

        <form onSubmit={handleSubmit} className="loginForm">
          {/* USERNAME */}
          <div className="formGroup">
            <label className="loginLabel">Username</label>
            <input
              type="email"
              className="loginInput"
              required
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="formGroup">
            <label className="loginLabel">Password</label>
            <div className="passwordWrapper">
              <input
                type={showPass ? "text" : "password"}
                className="loginInput"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="togglePassBtn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </div>
          </div>

          {error && <p className="loginError">{error}</p>}

          <button type="submit" className="loginBtn">
            Login
          </button>

          <p className="hintText">
            <span>Demo:</span> user: <b>admin</b> — pass: <b>admin123</b>
          </p>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
