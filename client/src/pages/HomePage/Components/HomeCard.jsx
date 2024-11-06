

import React from "react";

const HomeCard = ({ title, value, percentageChange, icon }) => {
  return (
    <div className="bg-black hover:cursor-pointer hover:border-white bg-opacity-70 py-4 md:py-6 px-4 md:px-8 rounded-md border border-[#C4AFAF] flex flex-col justify-between w-full mt-5 ">
      <div className="flex items-start justify-between">
        <p className="text-base md:text-lg lg:text-xl text-[#C4AFAF] font-medium">
          {title}
        </p>
        <div className="flex-shrink-0">
          <img src={icon} alt="Icon" width={40} height={40} />
        </div>
      </div>
      <div>
        <p className="text-3xl sm:text-4xl md:text-5xl text-[#BEB9B9] font-bold font-inter">
          {value}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-[#A8A8A8]">
          {percentageChange}
        </p>
      </div>
    </div>
  );
};

export default HomeCard;

