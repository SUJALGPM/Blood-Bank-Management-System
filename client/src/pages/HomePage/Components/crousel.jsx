import React, { useState, useEffect } from "react";
import blood_drop1 from "../../../assets/HomePage/Testimonial/blood_drop1.svg";

const slides = [
  {
    title: "# Being a Lifesaver",
    description:
      "Donating blood was a simple yet incredibly fulfilling experience! Knowing that just a small amount of my time could save a life made it all worth it. The staff was supportive, and the process was easy and safe. I would encourage everyone to try it at least once—it truly makes a difference!",
    icon: blood_drop1,
  },
  {
    title: "# Impacting Lives",
    description:
      "Dona was a simple yet incredibly fulfilling experience! Knowing that just a small amount of my time could save a life made it all worth it. The staff was supportive, and the process was easy and safe. I would encourage everyone to try it at least once—it truly makes a difference!",
    icon: blood_drop1,
  },
  {
    title: "# Join the Movement",
    description:
      "Donating blood was a simple yet incredibly fulfilling experience! Knowing that just a small amount of my time could save a life made it all worth it. The staff was supportive, and the process was easy and safe. I would encourage everyone to try it at least once—it truly makes a difference!",
    icon: blood_drop1,
  },
];

const delay = 5000; // Time in milliseconds for auto slide

const CustomCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0); // Reset progress on slide change
    }, delay);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / (delay / 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentSlide]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return (
    <div>
      <div
        className="w-[95%] md:w-[70%] mx-auto flex transition-transform duration-700 gap-4"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`flex-shrink-0 relative w-full h-[50vh] md:h-[65vh] border border-gray-500 bg-[#252A2F] flex items-center justify-between md:px-4 rounded-lg duration-500 ease-in-out  ${
              currentSlide === index
                ? "scale-105 shadow shadow-[#474747]"
                : "scale-90 opacity-20 "
            }`}
          >
            <div className="absolute top-4 lg:top-8 left-5 lg:left-14  w-[70%] lg:w-[35%]">
              <h2 className="text-[#ff5e5e] font-bold text-xl md:text-5xl mb-4">
                {slide.title}
              </h2>
              <p className="text-[#E8E8E8] text-xs md:text-base">
                {slide.description}
              </p>
              <p className="w-full self-end text-end italic font-thin mt-4 text-xs md:text-base">
                {"- Alex Rogger"}
              </p>
            </div>
            <div className="absolute bottom-0 right-8 w-[60%]">
              <img src={slide.icon} alt="Blood drop icon" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end  gap-3 mt-16 ">
        <div
          className="w-8 h-2 bg-slate-400 rounded cursor-pointer"
          onClick={() => {
            handlePrevSlide();
          }}
        ></div>
        <div className="w-12 bg-slate-200 h-2 rounded relative transition-all ease-in-out duration-500">
          <div
            className="bg-[#ff5e5e] h-full rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div
          className="w-8 h-2 bg-slate-400 rounded"
          onClick={() => {
            handleNextSlide();
          }}
        ></div>
      </div>
    </div>
  );
};

export default CustomCarousel;
