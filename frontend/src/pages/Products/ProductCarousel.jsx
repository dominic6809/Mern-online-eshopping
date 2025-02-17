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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="relative w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full">
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
            <div key={_id} className="outline-none">
              <div className="relative aspect-[16/9] w-full">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="mt-4 flex flex-col lg:flex-row gap-6 p-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{name}</h2>
                  <p className="text-2xl font-bold text-blue-600 mb-4">$ {price}</p>
                  <p className="text-gray-600">{description.substring(0, 170)}...</p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaStore className="text-blue-600" />
                    <span>Brand: {brand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    <span>Added: {moment(createdAt).fromNow()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-blue-600" />
                    <span>Reviews: {numReviews}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-blue-600" />
                    <span>Rating: {Math.round(rating)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShoppingCart className="text-blue-600" />
                    <span>Quantity: {quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBox className="text-blue-600" />
                    <span>In Stock: {countInStock}</span>
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