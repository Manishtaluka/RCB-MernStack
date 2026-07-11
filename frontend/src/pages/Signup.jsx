import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../schemas/authSchemas.js";
import { registerUser } from "../api/authApi.js";
import { setCredentials } from "../redux/slices/authSlice.js";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async ({ confirmPassword, ...payload }) => {
    setServerError("");
    setSubmitting(true);
    try {
      const { data } = await registerUser(payload);
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "name", label: "Full name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "confirmPassword", label: "Confirm password", type: "password" },
  ];

  return (
    <div className="container mx-auto pt-32 pb-16 flex justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-black/50 backdrop-blur rounded-lg p-8">
        <h1 className="font-poppins font-bold text-white text-3xl text-center mb-6">
          Join the <span className="text-rcb-gold">Bold Army</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {fields.map(({ name, label, type }) => (
            <div key={name}>
              <label className="text-white font-poppins text-sm block mb-1">{label}</label>
              <input
                type={type}
                {...register(name)}
                className="w-full rounded px-3 py-2 bg-white/90 font-poppins outline-none focus:ring-2 focus:ring-rcb-gold"
              />
              {errors[name] && (
                <p className="text-red-400 text-xs mt-1 font-poppins">{errors[name].message}</p>
              )}
            </div>
          ))}

          {serverError && <p className="text-red-400 text-sm font-poppins">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rcb-gold text-black font-poppins font-bold italic py-2 rounded disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-white/70 font-poppins text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-rcb-gold font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
