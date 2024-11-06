import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  User,
  Camera,
  UserRound,
  Mail,
  Droplet,
} from "lucide-react";
import Sidebar from "../../components/SideBar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/userContext";
import { useDonor } from "../../context/DonorContext";
import { useDonee } from "../../context/DoneeContext";

const ProfileEdit = () => {
  const { updateDonor } = useDonor();
  const {updateDonee} = useDonee();
  const { user, updateUser } = useUser();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    bloodgroup: "",
    birthdate: new Date(), // Default to current date
    healthStatus: "Good",
    image: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Load user data into state
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contactNo: user.phone || "",
        email: user.email || "",
        birthdate: user.birthDate ? new Date(user.birthDate) : new Date(), // Ensure valid date
        healthStatus: user.healthStatus || "Good",
        image: "https://i.pravatar.cc/300", 
      });
    }
  }, [user]);

  // Calculate age based on birthdate
  useEffect(() => {
    const today = new Date();
    const birthDate = new Date(profile.birthdate); // Ensure this is in Date format

    if (isNaN(birthDate.getTime())) {
      console.error("Invalid birthdate:", profile.birthdate);
      return; // Exit if the birthdate is invalid
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthdate hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    // Update the profile state with the calculated age
    setProfile((prevProfile) => ({
      ...prevProfile,
      age: calculatedAge, // Set the calculated age
    }));
  }, [profile.birthdate]);


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Validate fields for errors
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
      case "lastName":
        if (value.trim().length < 2) {
          newErrors[name] = `${name} must be at least 2 characters long.`;
        } else {
          delete newErrors[name];
        }
        break;
      case "contactNo":
        if (!/^\d{10}$/.test(value)) {
          newErrors.contactNo = "Contact number must be 10 digits.";
        } else {
          delete newErrors.contactNo;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Handle image file change and preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      console.log("Entered");
      console.log(user);
      if (user?.role?.toUpperCase() === "DONOR") {
        console.log("Entered 2");
        console.log(profile);
        await updateDonor(user.id, {
          email: profile.email,
          password: profile.password,
          first_name: profile.firstName,
          last_name: profile.lastName,
          contact: profile.contactNo,
          blood_group: profile.bloodgroup,
          age: profile.age,
          health_status: profile.healthStatus,
        });

        await updateUser({
          email: profile.email,
          password: profile.password,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.contactNo,
          blood_group: profile.bloodgroup,
          age: profile.age,
          health_status: profile.healthStatus,
        });
      }
      if (user?.role?.toUpperCase() === "DONEE") {
        console.log("Entered 2");
        console.log(profile);
        await updateDonee(user.id, {
          email: profile.email,
          password: profile.password,
          first_name: profile.firstName,
          last_name: profile.lastName,
          contact: profile.contactNo,
          blood_group: profile.bloodgroup,
          age: profile.age,
          health_status: profile.healthStatus,
        });

        await updateUser({
          email: profile.email,
          password: profile.password,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.contactNo,
          blood_group: profile.bloodgroup,
          age: profile.age,
          health_status: profile.healthStatus,
        });
      }
      setShowModal(true);
      setIsSubmitting(false);
    } else {
      console.log("Form has errors, please correct them.");
    }
  };

  
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div>
      <div className="flex flex-col md:flex-row h-full min-h-screen w-screen bg-gray-100 text-gray-100">
        <Sidebar />
        <div className="min-h-screen w-[70%] m-auto bg-gray-100 text-purple-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-purple-200">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-purple-100 md:w-1/3 p-8 flex flex-col items-center justify-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-purple-200 flex items-center justify-center transition-transform duration-300 transform group-hover:scale-105">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-purple-400" />
                    )}
                  </div>
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                  >
                    <Camera className="w-6 h-6" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="mt-4 text-xl text-purple-800 font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-purple-600">{profile.healthStatus}</p>
              </div>
              <div className="p-8 md:w-2/3">
                <h1 className="text-3xl font-bold mb-6 text-purple-900">
                  Edit Your Profile
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        name: "firstName",
                        label: "First Name",
                        icon: UserRound,
                      },
                      { name: "lastName", label: "Last Name", icon: UserRound },
                      {
                        name: "contactNo",
                        label: "Contact Number",
                        prefix: "+91 |",
                      },
                      { name: "email", label: "Email", icon: Mail },
                      {
                        name: "bloodgroup",
                        label: "Blood Group",
                        icon: Droplet,
                      },
                      { name: "healthStatus", label: "Health Status" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-purple-700"
                        >
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.name === "email" ? "email" : "text"}
                            value={profile[field.name]}
                            onChange={handleInputChange}
                            required
                            className="mt-1 pl-10 block w-full p-2 rounded-md bg-white border border-purple-300 text-purple-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-300"
                          />
                          {field.icon && (
                            <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
                          )}
                          {field.prefix && (
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                              {field.prefix}
                            </span>
                          )}
                        </div>
                        {errors[field.name] && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-purple-700">
                        Birthdate
                      </label>
                      <input
                        type="date"
                        value={profile.birthdate.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          setProfile((prev) => ({
                            ...prev,
                            birthdate: selectedDate,
                            age:
                              new Date().getFullYear() -
                              selectedDate.getFullYear(),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-white border border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700">
                        Age
                      </label>
                      <input
                        type="text"
                        value={profile.age}
                        readOnly
                        className="mt-1 block w-full rounded-md bg-purple-100 text-purple-900 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-6 w-full py-2 rounded-md bg-purple-600 text-white transition-opacity duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfileEdit;
