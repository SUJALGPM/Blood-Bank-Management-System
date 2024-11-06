import React from "react";
import DonationCard from "./DonationCard";
const donorDataArray = [
  {
    name: "Alice Johnson",
    bloodType: "A+",
    donationDate: "2023-10-10",
    location: "Mumbai City Hospital",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Rahul Sharma",
    bloodType: "B+",
    donationDate: "2023-09-15",
    location: "Delhi General Hospital",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Priya Verma",
    bloodType: "O+",
    donationDate: "2023-08-20",
    location: "Bangalore Medical Center",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Anil Kumar",
    bloodType: "AB+",
    donationDate: "2023-07-25",
    location: "Chennai Central Hospital",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Sneha Iyer",
    bloodType: "A-",
    donationDate: "2023-06-30",
    location: "Hyderabad Hospital",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Vikram Singh",
    bloodType: "B-",
    donationDate: "2023-05-12",
    location: "Pune Community Hospital",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Kiran Desai",
    bloodType: "O-",
    donationDate: "2023-04-18",
    location: "Ahmedabad City Hospital",
    img: "https://i.pravatar.cc/300",
  },
  {
    name: "Riya Malhotra",
    bloodType: "AB-",
    donationDate: "2023-03-05",
    location: "Kolkata Medical College",
    img: "https://i.pravatar.cc/300",
  },
];
const RecentDonation = () => {
  return (
    <div className="m-10 min-h-screen ">
      <p className="font-bold text-3xl ">Recent Donation</p>
      <p className="text-base font-light text-[#E8E8E8]">
        Overview of the latest blood donations
      </p>

      <div className="w-full my-10 self-center flex gap-4 flex-wrap items-center justify-center">
        {donorDataArray.map((donor, index) => (
          <DonationCard key={index} donor={donor} />
        ))}
      </div>
    </div>
  );
};

export default RecentDonation;
