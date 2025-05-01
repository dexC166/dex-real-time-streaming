import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModal';
import { BiChevronDown } from 'react-icons/bi';
import { BsFillPlayFill } from 'react-icons/bs';

interface MovieCardProps {
  data: Record<string, any>;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  const router = useRouter();
  const { openModal } = useInfoModalStore();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const redirectToWatch = useCallback(
    () => router.push(`/watch/${data.id}`),
    [router, data.id]
  );

  const handleCardClick = () => {
    if (window.innerWidth < 640) {
      // sm breakpoint in Tailwind
      setIsMobileExpanded(!isMobileExpanded);
    } else {
      redirectToWatch();
    }
  };

  return (
    <div className="group bg-zinc-900 col-span relative h-[30vw] sm:h-[30vw] md:h-[20vw] lg:h-[12vw] xs:h-[30vw]">
      <img
        onClick={handleCardClick}
        src={data.thumbnailUrl}
        alt="Movie"
        draggable={false}
        className={`
          cursor-pointer
          object-cover
          transition
          duration
          shadow-xl
          rounded-md
          group-hover:opacity-90
          sm:group-hover:opacity-0
          delay-300
          w-full
          h-full
          ${isMobileExpanded ? 'sm:opacity-100 opacity-0' : 'opacity-100'}
        `}
      />
      <div
        className={`
          absolute
          top-0
          transition
          duration-200
          z-10
          w-full
          h-full
          sm:invisible
          sm:scale-0
          sm:opacity-0
          sm:group-hover:scale-110
          sm:group-hover:-translate-y-[6vw]
          sm:group-hover:translate-x-[2vw]
          sm:group-hover:opacity-100
          sm:group-hover:visible
          ${
            isMobileExpanded
              ? 'opacity-100 scale-110 -translate-y-[6vw] translate-x-[2vw] visible'
              : 'opacity-0 scale-0 invisible'
          }
        `}
      >
        <img
          onClick={redirectToWatch}
          src={data.thumbnailUrl}
          alt="Movie"
          draggable={false}
          className="
            cursor-pointer
            object-cover
            transition
            duration
            shadow-xl
            rounded-t-md
            w-full
            h-[30vw]
            sm:h-[30vw]
            md:h-[20vw]
            lg:h-[12vw]
          "
        />
        <div
          className="
          z-10
          bg-zinc-800
          p-1
          sm:p-2
          lg:p-4
          absolute
          w-full
          transition
          shadow-md
          rounded-b-md
        "
        >
          <div className="flex flex-row items-center gap-1 sm:gap-3">
            <div
              onClick={(e) => {
                e.stopPropagation();
                redirectToWatch();
              }}
              className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
            >
              <BsFillPlayFill className="text-black w-3 sm:w-4 lg:w-6" />
            </div>
            <FavoriteButton movieId={data.id} />
            <div
              onClick={(e) => {
                e.stopPropagation();
                openModal(data?.id);
              }}
              className="cursor-pointer ml-auto group/item w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
            >
              <BiChevronDown className="text-white group-hover/item:text-neutral-300 w-3 sm:w-4 lg:w-6" />
            </div>
          </div>
          <p className="text-green-400 font-semibold mt-1 sm:mt-4 text-xs sm:text-sm">
            New <span className="text-white">2025</span>
          </p>
          <div className="flex flex-row mt-1 sm:mt-4 gap-1 sm:gap-2 items-center">
            <p className="text-white text-[8px] sm:text-[10px] lg:text-sm">
              {data.duration}
            </p>
          </div>
          <div className="flex flex-row items-center gap-1 sm:gap-2 mt-1 sm:mt-4 text-[6px] sm:text-[8px] text-white lg:text-sm">
            <p>{data.genre}</p>
          </div>
        </div>
      </div>
      {/* Mobile close button when expanded */}
      {isMobileExpanded && (
        <button
          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 z-20 sm:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileExpanded(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MovieCard;
