import React from "react";
import CustomCarousel from "./crousel";

const Testimonial = () => {
  return (
    <div className=" min-h-screen m-10">
      <p className="font-bold text-3xl ">Testimonial</p>
      <p className="text-base font-light text-[#E8E8E8] mb-10">
        Some of our Testimonials!
      </p>
      <div>
        <CustomCarousel />
      </div>
    </div>
  );
};

export default Testimonial;
