// Register.js
import React, { useState, useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "./Components/TextField";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import bg from "../../assets/Login/img3.jpg";
import vector from "../../assets/Register/Vector.svg";
import mob_vector from "../../assets/Login/Vector_mob.svg"; 
import Footer from "../../components/Footer/Footer";
import Logo from "../../assets/header_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, HeartPulse, SquareUserRound } from "lucide-react";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useDonor } from "../../context/DonorContext";
import { useDonee } from "../../context/DoneeContext";
import { useBloodManager } from "../../context/BloodManagerContext";

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
    <div
      className={`overflow-x-hidden w-screen h-full ${
        keyboardVisible ? "pb-20" : ""
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {loadingTimeout && (
        <div className="absolute top-0 right-0 left-0 z-50 h-full ">
          <LoadingPage />
        </div>
      )}

      <div className="relative w-full h-[145vh] lg:h-[120vh]">
        <img src={bg} alt="Background" className="object-cover w-full h-full" />
        <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-35 z-10"></div>

        {/* Mobile Vector Layout */}

        {/* Desktop Layout */}
        <div className="hidden lg:block absolute top-0 left-0 h-full lg:max-w-[70%] xl:max-w-[70%] max-w-[65%] z-30">
          <div className="relative h-full">
            <img src={vector} className="h-full object-cover" alt="Vector" />
            <div className="absolute top-6 left-10 w-[67%] h-[80%] p-8">
              <p className="text-3xl font-viga text-white">Welcome at,</p>
              <div className="w-full flex justify-end mt-4 pr-14">
                <Link to="/">
                  {/* <img src={""} alt="Logo" className="h-10" /> */}
                  <text className="text-3xl font-viga text-white">LifeFlow Nation</text>
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
                <p className="mb-2 mt-4 text-xs text-white">Select Role</p>
                <div className="flex w-full mt-2 gap-2">
                  <RoleSelection role={role} onRoleChange={handleRoleChange} />
                </div>

                <div className="mt-2 flex gap-4 text-white">
                  <TextField
                    label="Firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Enter your firstname"
                    icon={faUser}
                    error={errors.firstname}
                  />
                  <TextField
                    label="Lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Enter your lastname"
                    icon={faUser}
                    error={errors.lastname}
                  />
                </div>
                <div className="text-white">
                <TextField
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={faEnvelope}
                  error={errors.email}
                  />
                <TextField
                  type="tel"
                  label="Contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  icon={faPhone}
                  error={errors.contact}
                  />
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={faLock}
                  error={errors.password}
                  togglePasswordVisibility={() =>
                    setShowPassword((prev) => !prev)
                  }
                  showPassword={showPassword}
                  noCopy
                  />
                <TextField
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  name="confirmPsd"
                  value={formData.confirmPsd}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={faLock}
                  error={errors.confirmPsd}
                  togglePasswordVisibility={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  showPassword={showConfirmPassword}
                  noCopy
                  />
                </div>
                <div className="w-full flex justify-end mt-8">
                  <input
                    type="submit"
                    value={`Register as ${role.toUpperCase()}`}
                    className="text-center font-viga text-sm border shadow-md shadow-gray-400 hover:shadow-none cursor-pointer border-gray-500 rounded px-5 py-2 text-white"
                  />
                </div>
              </form>
              <div className="mt-8 flex justify-end">
                <p className="text-xs font-inter text-white">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-600">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden  w-screen absolute bottom-0  z-50 ">
          <div className="w-full  p-4 bg-gray-900 rounded-t-lg shadow-md mt-4">
            <div className="text-center mb-4">
              <p className="text-3xl font-viga">Welcome at,</p>
              <Link to="/">
                <img src={Logo} alt="Logo" className="h-10 mx-auto mt-2" />
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              <p className="mb-2 text-xs">Select Role</p>
              <div className="flex w-full mt-2 gap-2">
                <RoleSelection role={role} onRoleChange={handleRoleChange} />
              </div>

              <div className="mt-2 flex flex-col gap-4">
                <TextField
                  label="Firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Enter your firstname"
                  icon={faUser}
                  error={errors.firstname}
                />
                <TextField
                  label="Lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Enter your lastname"
                  icon={faUser}
                  error={errors.lastname}
                />
                <TextField
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={faEnvelope}
                  error={errors.email}
                />
                <TextField
                  type="tel"
                  label="Contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  icon={faPhone}
                  error={errors.contact}
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={faLock}
                  error={errors.password}
                  togglePasswordVisibility={() =>
                    setShowPassword((prev) => !prev)
                  }
                  showPassword={showPassword}
                  noCopy
                />
                <TextField
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  name="confirmPsd"
                  value={formData.confirmPsd}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={faLock}
                  error={errors.confirmPsd}
                  togglePasswordVisibility={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  showPassword={showConfirmPassword}
                  noCopy
                />
              </div>

              <div className="w-full flex justify-end mt-8">
                <input
                  type="submit"
                  value={`Register as ${role.toUpperCase()}`}
                  className="text-center font-viga text-sm border shadow-md shadow-gray-400 hover:shadow-none cursor-pointer border-gray-500 rounded px-5 py-2"
                />
              </div>
            </form>

            <div className="mt-10 flex justify-end">
              <p className="text-xs font-inter">
                Already have an account?{" "}
                <Link to="/login" className="text-red-600">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        
      </div>
      <Footer />
    </div>
  );
};

const RoleSelection = ({ role, onRoleChange }) => (
  <div className="flex gap-4">
    <RoleButton
      selected={role === "DONOR"}
      onClick={() => onRoleChange("DONOR")}
    >
      <Droplet className="w-4 h-4 mr-1" />
      Donor
    </RoleButton>
    <RoleButton
      selected={role === "DONEE"}
      onClick={() => onRoleChange("DONEE")}
    >
      <HeartPulse className="w-4 h-4 mr-1" />
      Donee
    </RoleButton>
    <RoleButton
      selected={role === "BLOOD MANAGER"}
      onClick={() => onRoleChange("BLOOD MANAGER")}
    >
      <SquareUserRound className="w-4 h-4 mr-1" />
      Blood Manager
    </RoleButton>
  </div>
);

const RoleButton = ({ selected, onClick, children }) => (
  <button
    className={`rounded py-2 px-2 border flex items-center text-sm ${
      selected ? "bg-yellow-600" : "bg-white"
    } hover:bg-yellow-500 duration-200`}
    onClick={onClick}
  >
    {children}
  </button>
);


export default Register;
