/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { Star } from "lucide-react";

const SmallProduct = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <HeartIcon product={product} />
        </div>
        {product.countInStock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-gray-800 font-medium line-clamp-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h2>
              <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-lg whitespace-nowrap">
                ${product.price}
              </span>
            </div>
            
            {product.brand && (
              <p className="text-sm text-gray-500">
                {product.brand}
              </p>
            )}

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;