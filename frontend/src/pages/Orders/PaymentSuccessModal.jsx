/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { CheckCircle, X, ShoppingBag, FileText } from 'lucide-react';

const PaymentSuccessModal = ({ isOpen, onClose, orderId = '' }) => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    setIsLoading(true);
    navigate(path);
    onClose();
    setIsLoading(false);
  };

  const confettiProps = {
    width: windowSize.width,
    height: windowSize.height,
    recycle: true,
    numberOfPieces: 500,
    gravity: 0.25,
    wind: 0.01,
    opacity: 0.8,
    colors: [
      '#4F46E5', '#10B981', '#F59E0B', '#EC4899',
      '#6366F1', '#34D399', '#F472B6', '#60A5FA',
    ],
    tweenDuration: 5000,
    initialVelocityY: 20,
    drawShape: ctx => {
      ctx.beginPath();
      for(let i = 0; i < 6; i++) {
        ctx.lineTo(
          Math.cos(2 * Math.PI * i / 6) * 5,
          Math.sin(2 * Math.PI * i / 6) * 5
        );
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-45">
        <Confetti {...confettiProps} />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-sm sm:max-w-lg mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-4 sm:p-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-green-100 mb-6 sm:mb-8">
              <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-green-600 animate-bounce" />
            </div>

            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Payment Successful!
              </h3>
              
              <p className="text-gray-600 mb-2">
                Thank you for shopping with us!
              </p>
              
              <p className="text-sm text-gray-500 mb-6 sm:mb-8">
                Your order confirmation and updates will be sent to your email.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleNavigation('/shop')}
                  disabled={isLoading}
                  className="group w-full inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Continue Shopping
                </button>
                
                <button
                  /* onClick={() => handleNavigation(`/orders/${orderId}`)} */
                  disabled={isLoading}
                  className="group w-full inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  View Order Details
                </button>
              </div>
            </div>
          </div>

          {/* <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
            <p className="text-sm text-center text-gray-500">
              Order #: <span className="font-medium text-gray-900">{orderId || Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </p>
          </div> */}
        </div>
      </div>

      <div className="fixed inset-0 z-55 pointer-events-none">
        <Confetti {...confettiProps} />
      </div>
    </>
  );
};

export default PaymentSuccessModal;