// import { useEffect, useState } from "react";
// import { HeartPulse } from "lucide-react";
// import Sidebar from "../../components/SideBar/Sidebar";
// import { useUser } from "../../context/userContext";
// import Footer from "../../components/Footer/Footer";
// import { useDonee } from "../../context/DoneeContext";

// const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// export default function BloodRequestForm() {
//   const { user } = useUser();
//   const { sendRequest } = useDonee();
//   const [doneeName, setDoneeName] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [quantityMl, setQuantityMl] = useState(450); // Default to standard blood donation amount
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   useEffect(() => {
//     if (user) {
//       setDoneeName(`${user.firstName} ${user.lastName}`);
//       setBloodGroup(`${user.blood_group}`);
//     }
//   }, [user]);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!doneeName || !bloodGroup || quantityMl < 1 || quantityMl > 5000) {
//       setError("Please fill in all fields correctly.");
//       return;
//     }

//     setIsSubmitting(true);
//     await sendRequest(user?.id, {
//       id: user?.id,
//       name: doneeName,
//       bloodgroup: bloodGroup,
//       quantity: quantityMl,
      
//     });
//     setIsSubmitting(false);
//     alert("Your blood donation request has been successfully submitted.");
//     setShowModal(true);

//     resetForm();
//   };

//   const resetForm = () => {
//     setDoneeName("");
//     setBloodGroup("");
//     setQuantityMl(450); // Reset to default
//   };

//   return (
//     <div className="bg-purple-900 text-purple-300 min-h-screen h flex flex-col">
      
//       <div className="flex-grow flex flex-col h-screen lg:flex-row">
//         <Sidebar />
//         <main className="flex-grow p-4 lg:p-8 flex items-center justify-center">
//           <div className="w-full max-w-md mx-auto bg-purple-500 p-6 rounded-lg shadow-lg">
//             <div className="text-center mb-4">
//               <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
//                 <HeartPulse className="w-6 h-6 text-red-500" />
//               </div>
//               <h2 className="text-2xl font-bold text-red-600">
//                 Blood Donation Request
//               </h2>
//               <p>
//                 Please fill out the form below to submit a blood donation
//                 request.
//               </p>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block font-semibold">Donee Name</label>
//                 <input
//                   type="text"
//                   placeholder="John Doe"
//                   value={doneeName}
//                   onChange={(e) => setDoneeName(e.target.value)}
//                   className="border border-red-200 rounded p-2 w-full bg-purple-700 text-white focus:outline-none focus:border-red-500"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold">Blood Group</label>
//                 <select
//                   value={bloodGroup}
//                   onChange={(e) => setBloodGroup(e.target.value)}
//                   className="border border-red-200 rounded p-2 w-full bg-purple-700 text-white focus:outline-none focus:border-red-500"
//                 >
//                   <option value="">Select blood group</option>
//                   {bloodGroups.map((group) => (
//                     <option key={group} value={group}>
//                       {group}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block font-semibold">Quantity (ml)</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="5000"
//                   value={quantityMl}
//                   onChange={(e) => setQuantityMl(Number(e.target.value))}
//                   className="border border-red-200 rounded p-2 w-full bg-purple-700 text-white focus:outline-none focus:border-red-500"
//                 />
//               </div>
//               {error && <p className="text-red-500">{error}</p>}
//               <button
//                 type="submit"
//                 className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-200"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Request"}
//               </button>
//             </form>
//             <p className="text-center text-sm text-purple-500 mt-4">
//               Your request will be processed as soon as possible.
//             </p>
//           </div>
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";
import Sidebar from "../../components/SideBar/Sidebar";
import { useUser } from "../../context/userContext";
import Footer from "../../components/Footer/Footer";
import { useDonee } from "../../context/DoneeContext";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodRequestForm() {
  const { user } = useUser();
  const { sendRequest } = useDonee();
  const [doneeName, setDoneeName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantityMl, setQuantityMl] = useState(450); // Default to standard blood donation amount
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (user) {
      setDoneeName(`${user.firstName} ${user.lastName}`);
      setBloodGroup(`${user.blood_group}`);
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!doneeName || !bloodGroup || quantityMl < 1 || quantityMl > 5000) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setIsSubmitting(true);
    await sendRequest(user?.id, {
      id: user?.id,
      name: doneeName,
      bloodgroup: bloodGroup,
      quantity: quantityMl,
      
    });
    setIsSubmitting(false);
    alert("Your blood donation request has been successfully submitted.");
    setShowModal(true);

    resetForm();
  };

  const resetForm = () => {
    setDoneeName("");
    setBloodGroup("");
    setQuantityMl(450); // Reset to default
  };

  return (
    <div className="bg-purple-100  min-h-screen h flex flex-col">
      
      <div className="flex-grow flex flex-col h-screen lg:flex-row">
        <Sidebar />
        <main className="flex-grow p-4 lg:p-8 flex text-purple-950 items-center justify-center">
          <div className="w-full max-w-md mx-auto bg-purple-200 p-6 rounded-lg shadow-lg">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-600">
                Blood Donation Request
              </h2>
              <p>
                Please fill out the form below to submit a blood donation
                request.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold">Donee Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={doneeName}
                  onChange={(e) => setDoneeName(e.target.value)}
                  className="border border-red-200 rounded p-2 w-full bg-purple-300 text-purple-950 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block font-semibold">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="border border-red-200 rounded p-2 w-full bg-purple-300 text-purple-950 focus:outline-none focus:border-red-500"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold">Quantity (ml)</label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={quantityMl}
                  onChange={(e) => setQuantityMl(Number(e.target.value))}
                  className="border border-red-200 rounded p-2 w-full bg-purple-300 text-purple-950 focus:outline-none focus:border-red-500"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
            <p className="text-center text-sm text-purple-500 mt-4">
              Your request will be processed as soon as possible.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}