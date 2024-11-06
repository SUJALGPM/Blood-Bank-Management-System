import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const TextField = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  let timeoutId;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);

    // Clear any existing timeout to prevent multiple timers
    clearTimeout(timeoutId);

    // If showing the password, set a timer to hide it after 5 seconds
    if (!showPassword) {
      timeoutId = setTimeout(() => {
        setShowPassword(false);
      }, 1500); // 5 seconds
    }
  };

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="mt-2">
      <p className="text-xs font-light">{label}</p>
      <div className="flex items-center border bg-[#999595] bg-opacity-20 border-slate-500 rounded mt-2 relative">
        <FontAwesomeIcon icon={icon} className="text-gray-500 p-3" />
        <input
          type={showPassword && type === "password" ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent placeholder:text-xs focus:outline-0 placeholder:text-gray-400 min-h-full rounded-r px-3 py-2 w-full"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default TextField;
