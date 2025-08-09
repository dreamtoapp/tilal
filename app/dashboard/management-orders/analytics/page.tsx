import { getOrderAnalytics } from '../actions/get-order-analytics';
import OrderAnalyticsView from './components/OrderAnalyticsView';

export default async function OrderAnalyticsPage() {
    // Fetch analytics data
    const analyticsResult = await getOrderAnalytics();

    return (
        <OrderAnalyticsView analyticsResult={analyticsResult} />
    );
} 