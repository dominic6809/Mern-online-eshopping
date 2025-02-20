/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [salesData, setSalesData] = useState([]);
  
  useEffect(() => {
    if (salesDetail) {
      const formattedData = salesDetail.map(item => ({
        date: item._id,
        sales: item.totalSales,
      }));
      setSalesData(formattedData);
    }
  }, [salesDetail]);

  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateGrowth = (data) => {
    if (!data || data.length < 2) return 0;
    const latestSales = data[data.length - 1].sales;
    const previousSales = data[data.length - 2].sales;
    return getPercentageChange(latestSales, previousSales);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KSH',
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminMenu />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Track your business performance and analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Sales</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {isLoading ? <Loader /> : formatCurrency(sales?.totalSales || 0)}
                  </h3>
                  {salesData.length > 1 && (
                    <p className={`text-sm mt-2 flex items-center ${calculateGrowth(salesData) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateGrowth(salesData) >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                      {Math.abs(calculateGrowth(salesData)).toFixed(1)}% from last period
                    </p>
                  )}
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Customers</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {loading ? <Loader /> : customers?.length.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Active accounts</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {loadingTwo ? <Loader /> : orders?.totalOrders.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Lifetime orders</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Sales Trend</h3>
                <select 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales Distribution Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Sales Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="sales" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>
            <OrderList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;