/* eslint-disable no-unused-vars */
import React from 'react';
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { AlertCircle } from 'lucide-react';

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-red-50 p-4 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700 font-medium">Failed to load products</p>
      </div>
    );
  }

  // return (
  //   // <div className="container mx-auto px-4 py-8">
  //   //   <div className="flex flex-col lg:flex-row gap-8">
  //       {/* Featured Products Grid */}
  //       {/* <div className="hidden xl:block w-full lg:w-1/2">
  //         <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Products</h2>
  //         <div className="grid grid-cols-2 gap-4">
  //           {data?.map((product) => (
  //             <div 
  //               key={product._id} 
  //               className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
  //             >
  //               <SmallProduct product={product} />
  //             </div>
  //           ))}
  //         </div>
  //       </div> */}

  //       {/* Product Carousel */}
  //       {/* <div className="w-full lg:w-1/2">
  //         <h2 className="text-2xl font-semibold mb-6 text-gray-800 xl:hidden">Featured Products</h2>
  //         <div className="bg-white rounded-lg shadow-sm">
  //           <ProductCarousel />
  //         </div>
  //       </div> */}
  //   //   </div>
  //   // </div>
  // );
};

export default Header;