import React from "react";
import MovieCard from "@/components/MovieCard";
import { isEmpty } from "lodash";

interface MovieListProps {
  data: Record<string, any>[];
  title: string;
}

const MovieList: React.FC<MovieListProps> = ({ data, title }) => {
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {data.map((movie) => (
            <div
              key={movie.id}
              className="w-full aspect-video xs:aspect-[16/9] sm:aspect-video"
            >
              <MovieCard data={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
