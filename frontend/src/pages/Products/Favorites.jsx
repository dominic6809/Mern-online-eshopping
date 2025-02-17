/* eslint-disable no-unused-vars */
import React from 'react';
import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { Heart } from "lucide-react";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Favorite Products
          </h1>
        </div>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved to your favorites
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600">
            Items you favorite will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;