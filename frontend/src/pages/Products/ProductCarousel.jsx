/* eslint-disable no-unused-vars */
import React from 'react';
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "product-carousel",
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings}>
          {products.map(({
            image,
            _id,
            name,
            price,
            description,
            brand,
            createdAt,
            numReviews,
            rating,
            quantity,
            countInStock,
          }) => (
            <div key={_id} className="outline-none p-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-[400px] w-full">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-2">{name}</h2>
                      <p className="text-3xl font-bold text-blue-600 mb-4">
                        Ksh {price}
                      </p>
                      <p className="text-gray-600 line-clamp-3">
                        {description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <FaStore className="text-blue-600" />
                        <span className="font-medium">{brand}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <FaClock className="text-blue-600" />
                        <span>{moment(createdAt).fromNow()}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <FaStar className="text-blue-600" />
                        <span>{numReviews} Reviews</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <FaStar className="text-yellow-400" />
                        <span>{rating.toFixed(1)} Rating</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <FaShoppingCart className="text-blue-600" />
                        <span>{quantity} Units</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <FaBox className="text-blue-600" />
                        <span>{countInStock} In Stock</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;