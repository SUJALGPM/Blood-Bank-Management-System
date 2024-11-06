import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/userContext";
import { useDonor } from "../../context/DonorContext";

export const MakeDonation = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const { makeDonation } = useDonor();

  useEffect(() => {
    if (user) {
      console.log(user);
      setName(`${user.firstName} ${user.lastName}`);
      setBloodGroup(`${user.blood_group}`);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !bloodGroup || !quantity) {
      alert("Please fill in all fields.");
      return;
    }
    console.log({ name, bloodGroup, quantity, donationDate });

    alert("Thank you for your donation!");
    setName("");
    setBloodGroup("");
    setQuantity("");
    setDonationDate(new Date().toISOString().slice(0, 16));

    await makeDonation({
      id: user?.id,
      name: name,
      bloodGroup: bloodGroup,
      quantity: quantity,
      donationDate: donationDate,
    });

    setShowModal(true);
  };

  return (
    <div className="bg-purple-200 text-purple-300 min-h-screen h flex flex-col">
      <div className="flex-grow flex flex-col h-screen lg:flex-row">
        <Sidebar />
        <div className="w-[70%] m-auto ">
          <main className="flex-grow p-4 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-md bg-white border border-purple-200 rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-center text-purple-700">
                Blood Donation Form
              </h2>
              <p className="text-center text-purple-600">
                Please fill in your details to donate blood.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-purple-700 font-semibold"
                  >
                    Donor Name
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className=" text-black w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="bloodGroup"
                    className="block text-purple-700 font-semibold"
                  >
                    Blood Type
                  </label>
                  <select
                    id="bloodGroup"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className=" text-black w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    required
                  >
                    <option value="">Select your blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="quantity"
                    className="block text-purple-700 font-semibold"
                  >
                    Quantity (ml)
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter donation quantity in ml"
                    min="0"
                    className=" text-black w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="donationDate"
                    className="block text-purple-700 font-semibold"
                  >
                    Donation Date & Time
                  </label>
                  <input
                    id="donationDate"
                    type="datetime-local"
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    className="text-black w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white transition duration-200"
                >
                  Submit Donation
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};
