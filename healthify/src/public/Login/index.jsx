import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import './Login.css'; // Ensure your stylesheet is included
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    console.log("Logging in with:", data);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Log the entire response to inspect the structure
      console.log("Login Response:", response.data);

      // Check if access_token and userType exist inside response.data
      if (response.data && response.data.token && response.data.userType) {
        console.log("Access Token:", response.data.token);
        localStorage.setItem("token", response.data.token); // ✅ Store Token

        // Navigate to the relevant dashboard based on userType
        if (response.data.userType === 'admin') {
          navigate("/admin-dashboard");
        } else if (response.data.userType === 'organization') {
          navigate("/hospital-dashboard");
        } else {
          console.error("Unknown user type:", response.data.userType);
        }
      } else {
        alert("Login failed! Check credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in. Please try again.");
    }

    reset();
  };

  return (
    <>
      <nav>
        <Link to="/" className="logo">
          <img src="src/img/logo.png" alt="Healthify" />
        </Link>
        <Link to="/" style={{ color: "aliceblue", textDecoration: "none" }}>
          <h1>Healthify | Login </h1>
        </Link>
        <div id="trans">
          <Link to="/register">Register</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>
      <div id="subnav">
        <Link to="/register">Register</Link>
        <Link to="/about">About</Link>
      </div>
      <main>
        <div id="login">
          <form id="entry" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input
              placeholder="Email"
              {...register('email')}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

            <label htmlFor="password">Password</label>
            <input
              placeholder="password"
              type="password"
              {...register('password')}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

            <div id="submitt" style={{ display: 'flex', alignItems: 'center' }}>
              <input className="button" type="submit" value="Sign In" />
              <p style={{ fontSize: '0.8rem' }}>
                New To Healthify? <Link to="/register" style={{ fontSize: '0.8rem' }}>Sign Up</Link>
              </p>
            </div>
          </form>
          <img src="src/img/doctor.jpg" alt="doctor" />
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Web Development Project. By Sarjak Bhandari.</p>
      </footer>
    </>
  );
};

export default Login;
