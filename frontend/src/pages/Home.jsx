/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { ArrowRight, Filter } from "lucide-react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct";
const CategoryButton = ({ children, isActive = false }) => (
  <button
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1920px] mx-auto overflow-x-hidden">
        {/* Featured Products Section */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
          
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Product Carousel Section */}
            <div className="w-full xl:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ProductCarousel />
              </div>
            </div>

            {/* Small Products Grid */}
            <div className="hidden xl:block xl:w-1/3">
              <div className="grid grid-cols-2 gap-4 h-full">
                {!isLoading && !isError && data?.products?.slice(0, 4).map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <SmallProduct product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <Loader />
            </div>
          ) : isError ? (
            <div className="max-w-2xl mx-auto mt-8">
              <Message variant="danger">
                {isError?.data?.message || isError.error}
              </Message>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-12">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Discover Our Special Products
                  </h1>
                  <p className="text-blue-100 text-lg mb-6">
                    Find the perfect items that match your style and needs.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    Shop Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Categories Section */}
              <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                <CategoryButton isActive>All Products</CategoryButton>
                <CategoryButton>New Arrivals</CategoryButton>
                <CategoryButton>Best Sellers</CategoryButton>
                <CategoryButton>Special Offers</CategoryButton>
              </div>

              {/* Filter and Sort Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <select className="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>
                
                <p className="text-gray-600">
                  Showing {data.products.length} products
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <div 
                    key={product._id} 
                    className="flex justify-center transform hover:-translate-y-1 transition-transform duration-200"
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>

              {/* Newsletter Section */}
              <div className="mt-16 bg-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Stay Updated
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Subscribe to our newsletter to receive updates about new products and special offers.
                </p>
                <div className="flex max-w-md mx-auto gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;