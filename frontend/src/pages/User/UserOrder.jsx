import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">My Orders</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.error || error.error}</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 border">Image</th>
                  <th className="py-3 px-4 border">ID</th>
                  <th className="py-3 px-4 border">Date</th>
                  <th className="py-3 px-4 border">Total</th>
                  <th className="py-3 px-4 border">Paid</th>
                  <th className="py-3 px-4 border">Delivered</th>
                  <th className="py-3 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="text-center border-t border-gray-200">
                    <td className="py-3 px-4 border">
                      <img src={order.orderItems[0].image} alt={order.user} className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="py-3 px-4 border">{order._id}</td>
                    <td className="py-3 px-4 border">{order.createdAt.substring(0, 10)}</td>
                    <td className="py-3 px-4 border font-semibold">$ {order.totalPrice}</td>
                    <td className="py-3 px-4 border">
                      {order.isPaid ? (
                        <span className="inline-block px-3 py-1 text-sm text-white bg-green-500 rounded-full">Completed</span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-sm text-white bg-red-500 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 border">
                      {order.isDelivered ? (
                        <span className="inline-block px-3 py-1 text-sm text-white bg-green-500 rounded-full">Completed</span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-sm text-white bg-red-500 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 border">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
