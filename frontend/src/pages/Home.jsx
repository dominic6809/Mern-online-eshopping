/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { ArrowRight, Filter, ShoppingBag, Truck, Shield, Headphones } from "lucide-react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";
import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const CategoryButton = ({ children, isActive = false, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white scale-105"
        : "bg-white text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const [activeCategory, setActiveCategory] = useState("all");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1920px] mx-auto overflow-x-hidden">
        {/* Hero Section */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-blue-800 min-h-[80vh] flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-6"
                {...fadeInUp}
              >
                Discover Amazing Products
              </motion.h1>
              <motion.p 
                className="text-blue-100 text-xl mb-8"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                Find everything you need with our curated selection of premium products.
              </motion.p>
              <motion.div 
                className="flex gap-4"
                {...fadeInUp}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of products to choose from</p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping</p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here to help you</p>
            </motion.div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Products
          </motion.h2>
          
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:w-2/3">
              <motion.div 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCarousel />
              </motion.div>
            </div>

            <div className="hidden xl:block xl:w-1/3">
              <div className="grid grid-cols-2 gap-4 h-full">
                {!isLoading && !isError && data?.products?.slice(0, 4).map((product) => (
                  <motion.div 
                    key={product._id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SmallProduct product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
            <CategoryButton 
              isActive={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              All Products
            </CategoryButton>
            <CategoryButton 
              isActive={activeCategory === "new"}
              onClick={() => setActiveCategory("new")}
            >
              New Arrivals
            </CategoryButton>
            <CategoryButton 
              isActive={activeCategory === "trending"}
              onClick={() => setActiveCategory("trending")}
            >
              Trending
            </CategoryButton>
            <CategoryButton 
              isActive={activeCategory === "featured"}
              onClick={() => setActiveCategory("featured")}
            >
              Featured
            </CategoryButton>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data?.message || isError.error}
            </Message>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.products.map((product) => (
                <motion.div 
                  key={product._id} 
                  className="flex justify-center"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Product product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Testimonials Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our Customers Say
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "John Doe",
                  role: "Verified Buyer",
                  content: "Amazing products and excellent customer service! Will definitely shop here again.",
                  rating: 5
                },
                {
                  name: "Jane Smith",
                  role: "Verified Buyer",
                  content: "The quality of the products exceeded my expectations. Fast shipping too!",
                  rating: 5
                },
                {
                  name: "Mike Johnson",
                  role: "Verified Buyer",
                  content: "Great selection of products and competitive prices. Highly recommended!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{testimonial.content}</p>
                  <div className="mt-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-blue-600 py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Shopping?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and discover our amazing products today.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive updates about new products and special offers.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">10K+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">5K+</h3>
                <p className="text-gray-600">Products Available</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">99%</h3>
                <p className="text-gray-600">Customer Satisfaction</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">24/7</h3>
                <p className="text-gray-600">Customer Support</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Download App Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-white mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
                <p className="text-blue-100 mb-6 max-w-md">
                  Get exclusive offers, easy order tracking, and a seamless shopping experience with our mobile app.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
                    <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 12.316l-3.236 3.236-3.236-3.236c-.195-.195-.195-.512 0-.707s.512-.195.707 0l2.529 2.529V7.5c0-.276.224-.5.5-.5s.5.224.5.5v6.638l2.529-2.529c.195-.195.512-.195.707 0s.195.512 0 .707z"/>
                    </svg>
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="text-xl font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
                    <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73-3.522-3.356c-.33-.314-.16-.888.282-.95l4.898-.696L7.708.876c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <div>
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-xl font-semibold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3">
                <img 
                  src="download.jpeg" 
                  alt="Mobile app preview" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;