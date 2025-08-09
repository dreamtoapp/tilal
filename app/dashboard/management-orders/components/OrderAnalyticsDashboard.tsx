import { GetOrderAnalyticsResult } from '../actions/get-order-analytics';
import OrderAnalyticsDashboardClient from './OrderAnalyticsDashboardClient';

interface OrderAnalyticsDashboardProps {
  analyticsData: GetOrderAnalyticsResult;
}

const OrderAnalyticsDashboard: React.FC<OrderAnalyticsDashboardProps> = ({ analyticsData }) => {
  if (!analyticsData.data) {
    return <div className="p-8 text-center text-red-600">لا توجد بيانات متاحة.</div>;
  }
  return <OrderAnalyticsDashboardClient data={analyticsData.data} />;
};

export default OrderAnalyticsDashboard;
