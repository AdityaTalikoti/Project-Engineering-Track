import React from 'react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerRow from '../components/CustomerRow';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';
import { Users } from 'lucide-react';

const Customers = () => {
  const { data: customers, isLoading, error, refetch } = useCustomers();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Customer Management</h1>

      {/* Loading → Error → Empty → Data */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order History</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <SkeletonCard count={4} variant="customer" />
            </tbody>
          </table>
        </div>
      ) : error ? (
        <ErrorMessage
          message="We couldn't load your customer list. The authentication server rejected the request. Try refreshing or click Retry."
          onRetry={refetch}
        />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          message="You have no registered customers yet. Once people sign up or place orders, they'll appear here."
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 capitalize">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order History</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {customers.map(customer => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
