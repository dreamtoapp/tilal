import { getCustomerReportData } from './action/getCustomerReportData';
import CustomerReportClient from './component/CustomerReportClient';

export default async function CustomersReportPage() {
  const data = await getCustomerReportData();

  return <CustomerReportClient {...data} />;
}
