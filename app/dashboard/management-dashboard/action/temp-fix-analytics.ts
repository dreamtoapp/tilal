'use server';

// Temporary analytics function that doesn't rely on database queries
export const fetchAnalytics = async () => {
  // Return default values to avoid the error
  return {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    inWayOrders: 0,
    canceledOrders: 0,
  };
};
