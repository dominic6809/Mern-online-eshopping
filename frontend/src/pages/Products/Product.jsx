/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between h-full">
        <Link to={`/product/${product._id}`} className="hover:underline">
          <h2 className="text-xl font-semibold text-gray-800 truncate">{product.name}</h2>
        </Link>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">$ {product.price}</span>
          <Link
            to={`/product/${product._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
