/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetProductsByCategoryQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import { Star, MessageSquare, Package } from "lucide-react";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data: relatedProducts, isLoading } = useGetProductsByCategoryQuery(
    product.category?._id,
    {
      skip: !product.category?._id,
    }
  );
  console.log({
    categoryId: product.category?._id,
    product,
    relatedProducts
  });
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, name: "Write Review", icon: Star },
    { id: 2, name: "Reviews", icon: MessageSquare },
    { id: 3, name: "Related Products", icon: Package },
  ];

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts?.filter(
    (relatedProduct) => relatedProduct._id !== product._id
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Navigation */}
        <div className="lg:w-64">
          <div className="sticky top-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "hover:bg-gray-100 text-gray-700 hover:scale-102"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Write Review Tab */}
          {activeTab === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors duration-200"
                    >
                      <option value="">Select Rating</option>
                      <option value="1">Inferior</option>
                      <option value="2">Decent</option>
                      <option value="3">Great</option>
                      <option value="4">Excellent</option>
                      <option value="5">Exceptional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors duration-200"
                      placeholder="Share your thoughts about the product..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 hover:shadow-md"
                  >
                    {loadingProductReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Please sign in to write a review
                  </p>
                  <Link
                    to="/login"
                    className="inline-block"
                  >
                    <button
                      type="button"
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
                    >
                      Sign in now →
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-xl shadow-sm p-6 space-y-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {review.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Ratings value={review.rating} />
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Related Products Tab */}
          {activeTab === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                More from {product.category?.name}
              </h3>
              
              {!filteredRelatedProducts || filteredRelatedProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No related products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRelatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct._id} className="transform hover:scale-105 transition-transform duration-200">
                      <SmallProduct product={relatedProduct} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;