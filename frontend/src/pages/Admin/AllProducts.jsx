/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery, useDeleteProductMutation } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        toast.success(`"${productName}" has been deleted`);
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">
          Error loading products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/6">
            <AdminMenu />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              All Products <span className="text-gray-500 text-lg">({products.length})</span>
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none transition-transform duration-300 hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                          {product.name}
                        </h2>
                        <span className="text-sm text-gray-500">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {product.description?.substring(0, 160)}...
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/product/update/${product._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
                          >
                            Update
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 hover:shadow-md"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-semibold text-gray-900">
                            Ksh {product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.countInStock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;