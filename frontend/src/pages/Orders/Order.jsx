/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Package, Truck, CreditCard, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

import PaymentSuccessModal from "./PaymentSuccessModal"


const OrderStatusBadge = ({ isPaid, isDelivered }) => {
  const getStatus = () => {
    if (isDelivered) return { text: "Delivered", color: "bg-green-100 text-green-800" };
    if (isPaid) return { text: "Paid", color: "bg-blue-100 text-blue-800" };
    return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
  };
  
  const status = getStatus();
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
      {status.text}
    </span>
  );
};

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        try {
          paypalDispatch({
            type: "resetOptions",
            value: {
              "client-id": paypal.clientId,
              currency: "USD",
            },
          });
          paypalDispatch({ type: "setLoadingStatus", value: "pending" });
        } catch (error) {
          console.error("PayPal script loading error:", error);
          toast.error("Failed to load PayPal. Please try again.");
        }
      };

      if (order && !order.isPaid) {
        loadPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const createOrderHandler = (data, actions) => {
    try {
      console.log("Creating PayPal order for amount:", order.totalPrice);
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice.toString(),
              currency_code: "USD",
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: order.itemsPrice
                },
                shipping: {
                  currency_code: "USD",
                  value: order.shippingPrice
                },
                tax_total: {
                  currency_code: "USD",
                  value: order.taxPrice
                }
              }
            },
            description: `Order ${orderId}`,
            items: order.orderItems.map(item => ({
              name: item.name,
              unit_amount: {
                currency_code: "USD",
                value: item.price.toString()
              },
              quantity: item.qty,
              description: `Product ID: ${item.product}`
            }))
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          brand_name: 'Your Store Name',
          cancel_url: `${window.location.origin}/order/${orderId}`,
          return_url: `${window.location.origin}/order/${orderId}`,
          user_action: 'PAY_NOW',
        }
      });
    } catch (err) {
      console.error("Create order error:", err);
      toast.error("Failed to create PayPal order. Please try again.");
      return null;
    }
  };

  const onCancelHandler = () => {
    toast.info("Payment cancelled. You can try again when ready.");
  };

  const onApproveHandler = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log("Payment successful. Details:", details);
  
      const result = await payOrder({ 
        orderId, 
        details: {
          id: details.id,
          status: details.status,
          update_time: details.update_time,
          payer: {
            email_address: details.payer.email_address
          }
        } 
      }).unwrap();
  
      refetch();
      setShowSuccessModal(true); // Show the success modal instead of the toast
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.data?.message || err.message || "Payment failed. Please try again.");
    }
  };

  const onErrorHandler = (err) => {
    console.error("PayPal error:", err);
    toast.error("PayPal encountered an error. Please try again.");
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered! 📦");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-500 mt-1">Order #{order._id}</p>
            </div>
            <OrderStatusBadge isPaid={order.isPaid} isDelivered={order.isDelivered} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>
              
              {order.orderItems.length === 0 ? (
                <div className="p-6">
                  <Message>Order is empty</Message>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
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
                          to={`/product/${item.product}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <span>{item.qty} units</span>
                          <span>×</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Delivery Address</p>
                    <p className="text-gray-500 mt-1">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Order Timeline</p>
                    <div className="text-gray-500 mt-1 space-y-1">
                      <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                      {order.isPaid && (
                        <p>Paid: {new Date(order.paidAt).toLocaleDateString()}</p>
                      )}
                      {order.isDelivered && (
                        <p>Delivered: {new Date(order.deliveredAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-900">${order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span className="text-gray-900">${order.taxPrice}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">${order.totalPrice}</span>
                  </div>
                </div>
              </div>

              {!order.isPaid && (
                <div className="mt-6">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div className="rounded-lg overflow-hidden">
                      <PayPalButtons
                        createOrder={createOrderHandler}
                        onApprove={onApproveHandler}
                        onError={onErrorHandler}
                        style={{ layout: "vertical" }}
                      />
                    </div>
                  )}
                </div>
              )}

              {loadingDeliver && <Loader />}
              
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Mark As Delivered
                </button>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Payment Method</p>
                    <p className="text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {order.isPaid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Payment Status</p>
                    <p className={order.isPaid ? "text-green-600" : "text-red-600"}>
                      {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Not paid"}
                    </p>
                  </div>
                </div>

                {order.isPaid && (
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Status</p>
                      <p className={order.isDelivered ? "text-green-600" : "text-yellow-600"}>
                        {order.isDelivered 
                          ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                          : "In Transit"}
                      </p>
                    </div>
                  </div>
                )}

                {order.isPaid && order.paymentResult && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Details</h3>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>Transaction ID: {order.paymentResult.id}</p>
                      <p>Status: {order.paymentResult.status}</p>
                      <p>Email: {order.paymentResult.email_address}</p>
                      <p>Updated: {new Date(order.paymentResult.update_time).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Order;