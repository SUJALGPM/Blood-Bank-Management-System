import React from "react";
import blood_bag from "../../../assets/HomePage/RecentDonation/blood_bag.svg";
import location from "../../../assets/HomePage/RecentDonation/Location.svg";
import calender from "../../../assets/HomePage/RecentDonation/Calender.svg";

const DonationCard = ({ donor }) => {
  const { name, bloodType, donationDate, location: donorLocation , img} = donor;

  return (
    <div className="p-4 border border-[#DFDFDF] rounded-lg flex gap-7 w-fit py-7 px-8 cursor-pointer hover:scale-105">
      <div className="rounded-full border-[#B8B8B8] border-dotted w-[79px] h-[79px] border-2 flex justify-center items-center">
        <div className="w-[72px] h-[72px] rounded-full overflow-hidden">
          <img
            src={img}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-row items-start">
        <p className="text-3xl text-[#E4E0E0] mb-[18px] font-bold">{name}</p>
        <div className="flex-row items-start">
          <div className="flex gap-5 mb-2">
            <div className="flex items-center">
              <img src={blood_bag} alt="Blood Type" />
              <p className="text-[#A8A8A8] ml-0.5">{bloodType}</p>
            </div>
            <div className="flex items-center">
              <img src={calender} alt="Donation Date" />
              <p className="text-[#A8A8A8] ml-2">{donationDate}</p>
            </div>
          </div>
          <div className="flex items-center">
            <img src={location} alt="Location" />
            <p className="text-[#A8A8A8] ml-2">{donorLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
