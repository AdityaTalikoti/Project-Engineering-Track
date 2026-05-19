import React from 'react';

/**
 * SkeletonCard — renders `count` shimmer skeleton cards that mirror OrderCard's shape.
 * Also used in a 2-col and 4-col layout variation via the `variant` prop.
 *
 * Props:
 *   count   {number}  — number of skeleton cards to render (default: 4)
 *   variant {string}  — 'order' | 'product' | 'customer' | 'stat' (default: 'order')
 */
const OrderSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center animate-pulse">
    <div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-32" />
    </div>
    <div className="text-right">
      <div className="h-5 bg-gray-200 rounded w-16 mb-2" />
      <div className="h-4 bg-gray-200 rounded-full w-14" />
    </div>
  </div>
);

const ProductSkeleton = () => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4" />
    <div className="flex justify-between items-start mb-2">
      <div className="h-4 bg-gray-200 rounded w-36" />
      <div className="h-4 bg-gray-200 rounded w-14" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-20 mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 rounded w-16" />
      <div className="h-3 bg-gray-200 rounded w-12" />
    </div>
  </div>
);

const CustomerSkeleton = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div>
          <div className="h-3 bg-gray-200 rounded w-28 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-40" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded w-16" /></td>
    <td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded w-20" /></td>
    <td className="px-6 py-4 text-right"><div className="h-3 bg-gray-200 rounded w-20 ml-auto" /></td>
  </tr>
);

const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between animate-pulse">
    <div>
      <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
      <div className="h-7 bg-gray-200 rounded w-28" />
    </div>
    <div className="w-12 h-12 bg-gray-200 rounded-full" />
  </div>
);

const SKELETON_MAP = {
  order: OrderSkeleton,
  product: ProductSkeleton,
  customer: CustomerSkeleton,
  stat: StatSkeleton,
};

const SkeletonCard = ({ count = 4, variant = 'order' }) => {
  const Skeleton = SKELETON_MAP[variant] || OrderSkeleton;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
};

export default SkeletonCard;
