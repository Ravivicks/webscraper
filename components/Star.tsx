// components/StarRating.tsx
import { FC } from "react";

interface StarProps {
  starId: number;
  rating: number;
}

const Star: FC<StarProps> = ({ starId, rating }) => {
  const fillPercentage = Math.min(Math.max(rating - starId + 1, 0), 1) * 100;

  return (
    <div className="relative w-8 h-8">
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${fillPercentage}%` }}
      >
        <svg
          className="w-full h-full text-yellow-400"
          fill="yellow"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      </div>
      <svg
        className="absolute top-0 left-0 w-full h-full text-gray-300"
        fill="yellow"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </div>
  );
};

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating: FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      <span className="text-lg font-semibold mr-2">{rating.toFixed(1)}</span>
      <div className="flex space-x-1">
        {[...Array(totalStars)].map((_, i) => (
          <Star key={i} starId={i + 1} rating={rating} />
        ))}
      </div>
      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default StarRating;
