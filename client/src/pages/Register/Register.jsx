// Register.js
import React, { useState, useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, HeartPulse, UserCog } from "lucide-react";
import { useDonor } from "../../context/DonorContext";
import { useDonee } from "../../context/DoneeContext";
import { useBloodManager } from "../../context/BloodManagerContext";
import Header from "../../components/Header/Header";

const Register = () => {
  const {
    registerDonor,
    loading: loadingDonor,
    error: donorError,
  } = useDonor();
  const {
    registerDonee,
    loading: loadingDonee,
    error: doneeError,
  } = useDonee();
  const {
    registerManager,
    loading: loadingManager,
    error: managerError,
  } = useBloodManager();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    contact: "",
    confirmPsd: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("DONOR");
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setKeyboardVisible(window.innerHeight < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (loadingDonor || loadingManager || loadingDonee) {
      setLoadingTimeout(true);
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(false);
      }, 5555);
      return () => clearTimeout(timeoutId);
    } else {
      setLoadingTimeout(false);
    }
  }, [loadingDonor, loadingManager, loadingDonee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const registrationData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstname,
      last_name: formData.lastname,
      contact: formData.contact,
    };

    let registrationResponse;
    if (role === "DONOR") {
      registrationResponse = await registerDonor(registrationData);
    } else if (role === "DONEE") {
      registrationResponse = await registerDonee(registrationData);
    } else if (role === "BLOOD_MANAGER") {
      registrationResponse = await registerManager(registrationData);
    }

    const error =
      registrationResponse?.error ||
      (role === "DONOR"
        ? donorError
        : role === "DONEE"
        ? doneeError
        : managerError);
    if (error) {
      console.log(error);
      toast.error(error, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      setIsModalOpen(true);
    }
    setIsModalOpen(true);
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.firstname) newErrors.firstname = "Firstname is required.";
    if (!data.lastname) newErrors.lastname = "Lastname is required.";
    if (!data.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Invalid email.";
    if (!data.contact) newErrors.contact = "Contact number is required.";
    else if (!/^\d{10}$/.test(data.contact))
      newErrors.contact = "Must be 10 digits.";
    if (!data.password) newErrors.password = "Password is required.";
    else if (data.password.length < 8) newErrors.password = "Min 8 characters.";
    if (!data.confirmPsd)
      newErrors.confirmPsd = "Confirm Password is required.";
    else if (data.password !== data.confirmPsd)
      newErrors.confirmPsd = "Passwords do not match.";

    return newErrors;
  };

  return (
    <div className="min-h-screen bg-purple-700 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-700 mb-6">
            Register your account
          </h2>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Role
              </label>
              <div className="flex flex-wrap sm:flex-nowrap space-y-2 sm:space-y-0 sm:space-x-2">
                <RoleButton
                  role="DONOR"
                  currentRole={role}
                  setRole={setRole}
                  icon={<Droplet className="w-4 h-4" />}
                />
                <RoleButton
                  role="DONEE"
                  currentRole={role}
                  setRole={setRole}
                  icon={<HeartPulse className="w-4 h-4" />}
                />
                <RoleButton
                  role="MANAGER"
                  currentRole={role}
                  setRole={setRole}
                  icon={<UserCog className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                error={errors.firstname}
              />
              <InputField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                error={errors.lastname}
              />
            </div>

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputField
              label="Contact"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              error={errors.contact}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition duration-200"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-purple-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} LifeFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

function RoleButton({ role, currentRole, setRole, icon }) {
  return (
    <button
      type="button"
      onClick={() => setRole(role)}
      className={`flex-1 inline-flex justify-center items-center px-3 py-2 border rounded-md text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ${
        currentRole === role
          ? "border-purple-700 text-purple-700 bg-purple-50"
          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="ml-2">{role}</span>
    </button>
  );
}

function InputField({ label, name, type = "text", value, onChange, error }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
            error ? "border-red-300" : "border-gray-300"
          }`}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default Register;