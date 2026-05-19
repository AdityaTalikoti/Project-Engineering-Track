import React from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';
import { ShoppingCart } from 'lucide-react';

const Orders = () => {
  const { data: orders, isLoading, error, refetch } = useOrders();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          Export Report
        </button>
      </div>

      {/* Loading → Error → Empty → Data */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          <SkeletonCard count={4} variant="order" />
        </div>
      ) : error ? (
        <ErrorMessage
          message="We couldn't load your orders. This may be a temporary server issue — check your connection and try again."
          onRetry={refetch}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          message="Once customers start placing orders, they'll appear here. New orders show up automatically."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
