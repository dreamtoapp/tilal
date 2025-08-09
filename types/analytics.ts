import { Product as ProductType } from '@/types/databaseTypes';; // Assuming ProductType is your shared product type

export interface SalesByMonthData {
  month: string;
  sales: number; // Represents REVENUE for the month
  orders?: number; // Optional: count of orders for that month
}

export interface OrderHistoryItem {
  id: string; // OrderItem ID
  quantity: number;
  price?: number;
  orderId: string; // Actual Order ID
  order?: {
    createdAt?: string | Date;
    customerName?: string | null;
    status?: string;
    orderNumber?: string;
  } | null;
}

export interface ReviewItem {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO string date
}

export interface ReviewsAnalytics {
  list: ReviewItem[];
  average: number;
  count: number;
}

export interface AnalyticsData {
  product: ProductType;
  totalRevenue: number;
  totalOrders: number; // Unique orders
  totalCustomers: number; // Unique customers
  salesByMonth: SalesByMonthData[];
  orderHistory: OrderHistoryItem[];
  reviews?: ReviewsAnalytics;
  totalProfit: number;
  averageProfitMargin: number;
  activityStartDate?: string | null;
  activityEndDate?: string | null;
}
