/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, CreditCard, Package, Truck, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
      toast.success("Order placed successfully! 🎉", {
        className: "bg-green-50 border-green-500"
      });
    } catch (error) {
      toast.error(error?.data?.message || "Error placing order");
    }
  };

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 text-center">Looks like you haven&apos;t added any items to your cart yet.</p>
        <Link 
          to="/shop"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressSteps step1 step2 step3 />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <Package className="w-5 h-5 text-blue-600" />
                  Order Items ({cart.cartItems.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.cartItems.map((item) => (
                  <div key={item._id} className="p-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <Link 
                        to={`/product/${item._id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${(item.qty * item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium">{cart.shippingAddress.address}</p>
                  <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                  <p>{cart.shippingAddress.country}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Method
                </h2>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{cart.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {cart.shippingPrice === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${cart.shippingPrice}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">${cart.taxPrice}</span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${cart.totalPrice}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-sm text-red-600">{error.data.message}</p>
                  </div>
                )}

                <button
                  onClick={placeOrderHandler}
                  disabled={isLoading}
                  className="w-full mt-6 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader size="small" />
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Place Order Securely
                    </div>
                  )}
                </button>

                <p className="mt-4 text-sm text-gray-500 text-center">
                  By placing your order, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;