/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import {
  ChevronLeft,
  Store,
  Clock,
  Star,
  ShoppingCart,
  Package,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  Check
} from "lucide-react";
import moment from "moment";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const BenefitCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
    <Icon className="w-6 h-6 text-blue-600 mt-1" />
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const ColorVariant = ({ color, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
      isSelected ? 'border-blue-600 scale-110' : 'border-gray-300 hover:border-gray-400'
    }`}
  >
    <span
      className="block w-full h-full rounded-full"
      style={{ backgroundColor: color }}
    />
    {isSelected && (
      <span className="absolute inset-0 flex items-center justify-center">
        <Check className="w-6 h-6 text-white drop-shadow-md" />
      </span>
    )}
  </button>
);

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Example variants - in practice, these would come from your product data
  const variants = [
    { id: 0, color: '#000000', name: 'Black', image: product?.image },
    { id: 1, color: '#CC0000', name: 'Red', image: product?.image },
    { id: 2, color: '#0066CC', name: 'Blue', image: product?.image },
    { id: 3, color: '#4CAF50', name: 'Green', image: product?.image }
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ 
      ...product, 
      qty,
      variant: variants[selectedVariant].name 
    }));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Shop
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image Section */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <img
                  src={variants[selectedVariant].image}
                  alt={`${product.name} - ${variants[selectedVariant].name}`}
                  className="w-full h-auto rounded-lg mb-6"
                />
                <div className="absolute top-8 right-8">
                  <HeartIcon product={product} />
                </div>
                
                {/* Color/Design Variants */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {variants.map((variant) => (
                    <ColorVariant
                      key={variant.id}
                      color={variant.color}
                      isSelected={selectedVariant === variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                    />
                  ))}
                </div>
                <div className="text-center mt-3 text-gray-600">
                  Selected: {variants[selectedVariant].name}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col">
              <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-500">
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <p className="text-4xl font-bold text-gray-900 mb-6">
                  ${product.price}
                </p>

                <p className="text-gray-600 mb-8">{product.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Brand: {product.brand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Added: {moment(product.createAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Rating: {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Stock: {product.countInStock}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="flex items-center gap-4">
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="flex-1 inline-flex justify-center items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BenefitCard
                  icon={Truck}
                  title="Free Shipping"
                  description="On orders over $100"
                />
                <BenefitCard
                  icon={Shield}
                  title="Secure Payment"
                  description="100% secure checkout"
                />
                <BenefitCard
                  icon={RefreshCw}
                  title="Easy Returns"
                  description="30 day return policy"
                />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-2">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;