export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          className={`text-2xl ${
            star <= rating ? 'text-yellow-500' : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition'}`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
