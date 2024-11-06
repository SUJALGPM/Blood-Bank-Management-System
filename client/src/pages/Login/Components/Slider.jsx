import React from "react";

const RoleSlider = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="relative  rounded border border-gray-600">
      <div
        className="absolute inset-0 h-full rounded transition-all duration-300 ease-out bg-red-500 "
        style={{
          width: "33.33%",
          transform: `translateX(${
            selectedRole === "blood manager"
              ? "0%"
              : selectedRole === "donor"
              ? "100%"
              : "200%"
          })`,
        }}
      />
      <div className="relative flex">
        {["blood manager", "donor", "donee"].map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
              selectedRole === role
                ? "text-primary-foreground"
                : "text-gray-200"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSlider;
