/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { ShoppingCart, ArrowRight, Star, Check } from "lucide-react";
import { useState } from "react";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const [showCheck, setShowCheck] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const isInCart = cartItems.some(item => item._id === p._id);

  const addToCartHandler = (product, qty) => {
    if (product.countInStock === 0) {
      toast.error("Sorry, this item is out of stock", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    setShowCheck(true);
    toast.success("Added to cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });

    // Reset to cart icon after 2 seconds
    setTimeout(() => {
      setShowCheck(false);
    }, 2000);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon product={p} />
        </div>

        {p.countInStock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Out of Stock
          </div>
        )}

        {p.countInStock > 0 && p.countInStock <= 5 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
            Only {p.countInStock} left
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-sm font-semibold px-3 py-1 rounded-lg">
            {p?.brand}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link to={`/product/${p._id}`} className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {p?.name}
            </h3>
          </Link>
          <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
            ${p?.price?.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-current text-yellow-400" />
          <span className="text-sm text-gray-600">
            {p.rating} ({p.numReviews} reviews)
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {p?.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <button
            onClick={() => addToCartHandler(p, 1)}
            disabled={p.countInStock === 0}
            className={`inline-flex items-center justify-center p-3 rounded-lg transition-all duration-300
              ${showCheck 
                ? 'bg-green-500 text-white' 
                : p.countInStock === 0
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {showCheck ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;