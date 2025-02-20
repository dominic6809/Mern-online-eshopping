/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { ArrowRight, Filter, ShoppingBag, Truck, Shield, Headphones } from "lucide-react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";
import SmallProduct from "./Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import AOS from 'aos';
import 'aos/dist/aos.css';

const CategoryButton = ({ children, isActive = false, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white scale-100 shadow-md"
        : disabled 
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,  // Reduced from 1000
      once: true,
      easing: 'ease-out-cubic',
      disable: window.innerWidth < 768 // Disable on mobile for better performance
    });
  }, []);

  useEffect(() => {
    if (data?.products) {
      setIsFiltering(true);
      
      // Use setTimeout to prevent UI blocking
      const filterTimeout = setTimeout(() => {
        const filtered = data.products.filter(product => {
          switch(activeCategory) {
            case "new":
              return (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) <= 30;
            case "trending":
              return product.rating >= 4 && product.numReviews > 10;
            case "featured":
              return product.isFeatured;
            default:
              return true;
          }
        });
        
        setFilteredProducts(filtered);
        setIsFiltering(false);
      }, 100);

      return () => clearTimeout(filterTimeout);
    }
  }, [activeCategory, data]);

  // Updated Categories Section
  const renderProductGrid = () => {
    if (isLoading || isFiltering) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Message variant="info">
            No products found in this category.
          </Message>
        </div>
      );
    }

    return activeCategory === "all" ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map((product, index) => (
          <div 
            key={product._id}
            className="w-full"
          >
            <SmallProduct product={product} />
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div 
            key={product._id} 
            className="flex justify-center"
          >
            <Product product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-blue-800 min-h-[85vh] flex items-center relative overflow-hidden"
        data-aos="fade-up"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl" data-aos="fade-up" data-aos-delay="200">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Amazing Products
            </h1>
            <p className="text-blue-100 text-xl mb-8">
              Find everything you need with our curated selection of premium products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group px-8 py-4 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: ShoppingBag,
              title: "Wide Selection",
              description: "Thousands of products to choose from",
              color: "bg-blue-50"
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              description: "Quick and reliable shipping",
              color: "bg-green-50"
            },
            {
              icon: Shield,
              title: "Secure Shopping",
              description: "100% secure payment processing",
              color: "bg-purple-50"
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              description: "Always here to help you",
              color: "bg-orange-50"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.color} p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-all duration-300`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 
          className="text-4xl font-bold text-gray-800 mb-4 text-center"
          data-aos="fade-up"
        >
          Featured Products
        </h2>
        <p 
          className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover our handpicked selection of premium products that offer the best quality and value.
        </p>
        <div data-aos="fade-up" data-aos-delay="200">
          <ProductCarousel />
        </div>
      </div>

      {/* Updated Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <CategoryButton 
            isActive={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            disabled={isFiltering}
          >
            New Arrivals
          </CategoryButton>
          <CategoryButton 
            isActive={activeCategory === "new"}
            onClick={() => setActiveCategory("new")}
            disabled={isFiltering}
          >
            All Products
          </CategoryButton>
          <CategoryButton 
            isActive={activeCategory === "trending"}
            onClick={() => setActiveCategory("trending")}
            disabled={isFiltering}
          >
            Trending
          </CategoryButton>
          <CategoryButton 
            isActive={activeCategory === "featured"}
            onClick={() => setActiveCategory("featured")}
            disabled={isFiltering}
          >
            Featured
          </CategoryButton>
        </div>

        {renderProductGrid()}
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl font-bold text-gray-800 mb-12 text-center"
            data-aos="fade-up"
          >
            What Our Customers Say
          </h2>
          
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
              <div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 200}
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
                <p className="text-gray-700 italic">{testimonial.content}</p>
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-24">
        <div 
          className="max-w-4xl mx-auto bg-white rounded-2xl p-12 shadow-xl"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Subscribe to our newsletter to receive updates about new products and special offers.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "5K+", label: "Products Available" },
              { number: "99%", label: "Customer Satisfaction" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 py-24">
        <div className="container mx-auto px-4">
          <div 
            className="text-center"
            data-aos="fade-up"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover our amazing products today.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;