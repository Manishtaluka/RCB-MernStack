import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginSchema } from "../schemas/authSchemas.js";
import { loginUser } from "../api/authApi.js";
import { setCredentials } from "../redux/slices/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setServerError("");
    setSubmitting(true);
    try {
      const { data } = await loginUser(formData);
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      navigate(location.state?.from || "/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto pt-32 pb-16 flex justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-black/50 backdrop-blur rounded-lg p-8">
        <h1 className="font-poppins font-bold text-white text-3xl text-center mb-6">
          Login to <span className="text-rcb-gold">RCB</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="text-white font-poppins text-sm block mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded px-3 py-2 bg-white/90 font-poppins outline-none focus:ring-2 focus:ring-rcb-gold"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 font-poppins">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-white font-poppins text-sm block mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded px-3 py-2 bg-white/90 font-poppins outline-none focus:ring-2 focus:ring-rcb-gold"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 font-poppins">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-red-400 text-sm font-poppins">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rcb-gold text-black font-poppins font-bold italic py-2 rounded disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-white/70 font-poppins text-sm text-center mt-6">
          New to RCB?{" "}
          <Link to="/signup" className="text-rcb-gold font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
