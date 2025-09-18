import { FC, useState, ChangeEvent, FormEvent } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import { MdOutlineLocalPhone, MdLock } from "react-icons/md";
import axios from "axios";

interface User {
  id: number;
  name: string;
  phoneNumber: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ phoneNumber: string; password: string }>({ phoneNumber: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://catholicportal.net/api/Auth/AuthenticateUserCred",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            msisdn: formData.phoneNumber,
            password: formData.password,
          }),
        }
      );

      setLoading(false);

      if (response.ok) {
        const userData = await getUserByMsisdn(formData.phoneNumber);
        // console.log("User authenticated successfully!");
        setUser(userData);

        navigate("/");
      } else {
        console.error("Authentication failed!");
        navigate("/login");

        setError(
          "Authentication failed! Please check your credentials and try again."
        );
      }
    } catch (error) {
      console.error("An error occurred during authentication:", error);
      setError(
        "An error occurred during authentication. Please try again later."
      );
      setLoading(false);
    }
  };

  async function getUserByMsisdn(msisdn: string) {
    try {
      const response = await axios.get(
        `https://catholicportal.net/api/Auth/GetUserByMsisdn?msisdn=${msisdn}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      // console.log(response.data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      setError("Error fetching user data.");
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center"
    // bg-gray-100 px-5
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome</h1>
        <p className="text-gray-600 text-center mb-6">Log in to access your account</p>

        <div className="flex items-center mb-4 bg-gray-100 rounded-md p-3">
          <MdOutlineLocalPhone size={20} className="text-gray-400" />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none text-sm pl-2 placeholder-gray-500 focus:outline-none"
            placeholder="Phone number"
            required
          />
        </div>

        <div className="flex items-center mb-6 bg-gray-100 rounded-md p-3">
          <MdLock size={20} className="text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none text-sm pl-2 placeholder-gray-500 focus:outline-none"
            placeholder="Password"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-full text-white font-semibold transition-colors ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Loading..." : "Log in"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{"   "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;