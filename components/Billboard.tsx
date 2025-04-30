import useBillboard from "@/hooks/useBillboard";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import PlayButton from "./PlayButton";
import useInfoModal from "@/hooks/useInfoModal";

const Billboard = () => {
  const { data } = useBillboard();
  const { openModal } = useInfoModal();
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOpenModal = useCallback(() => {
    openModal(data?.id);
  }, [openModal, data?.id]);

  return (
    <div className="relative h-[56.25vw] w-full overflow-hidden">
      <video
        className={`
          absolute top-0 left-0 
          w-full
          h-full 
          object-cover
          transform 
          brightness-[60%]
          ${isMobile ? "scale-[1.4]" : "scale-[1.4]"}
        `}
        autoPlay
        muted
        loop
        playsInline
        poster={data?.thumbnailUrl}
        src={data?.videoUrl}
      ></video>
      {/* Add a background overlay to prevent black space */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-[-1]"></div>
      <div className="absolute top-[20%] xs:top-[25%] sm:top-[30%] md:top-[40%] ml-4 md:ml-16 w-[90%] md:w-auto">
        <p className="text-white text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">
          {data?.title}
        </p>
        <p className="text-white text-[10px] xs:text-xs sm:text-sm md:text-lg mt-2 xs:mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {data?.description}
        </p>
        <div className="flex flex-row items-center mt-2 xs:mt-3 md:mt-4 gap-2 xs:gap-3">
          <PlayButton movieId={data?.id} />
          <button
            onClick={handleOpenModal}
            className="
              bg-white
              text-white
              bg-opacity-30
              rounded-md
              py-1 md:py-2
              px-2 md:px-4
              w-auto
              text-[10px] xs:text-xs md:text-sm lg:text-lg
              font-semibold
              flex
              flex-row
              items-center
              hover:bg-opacity-20
              transition
            "
          >
            <AiOutlineInfoCircle className="mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
