import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return favoriteCount > 0 ? (
    <span className="absolute -top-2 -right-2 px-2 py-1 text-xs text-white bg-pink-500 rounded-full">
      {favoriteCount}
    </span>
  ) : null;
};

export default FavoritesCount;
