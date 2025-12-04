import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { loginSuccess } from "../store/slices/authSlice";

const OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      toast.error("Email not found, please register again.");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
      toast.success("Account verified successfully!");

      // Auto-login after verification
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password: localStorage.getItem('temp_password')
      });
      dispatch(loginSuccess(data.user));
      localStorage.removeItem('temp_password');

      navigate("/catalog");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900 px-4">
      <div className="glass-panel p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Verify Account</h2>
        <p className="text-center text-gray-400 mb-6">
          Enter the verification code sent to <span className="text-indigo-400">{email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field text-center tracking-widest text-2xl"
              placeholder="12345"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Verify"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTP;
