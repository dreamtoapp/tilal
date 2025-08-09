"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { getOrderByStatus } from "../actions/getOrderByStatus";
import type { Order } from "@/types/databaseTypes";

interface MonthlyData { month: string; count: number; }

export default function DriverAnalyticsPage() {
    const [delivered, setDelivered] = useState<number>(0);
    const [canceled, setCanceled] = useState<number>(0);
    const [revenue, setRevenue] = useState<number>(0);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [monthly, setMonthly] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            const driverId = new URLSearchParams(window.location.search).get("driverId") || "";
            const deliveredRes = await getOrderByStatus(driverId, "DELIVERED");
            const canceledRes = await getOrderByStatus(driverId, "CANCELED");
            const deliveredOrders = deliveredRes.ordersToShip || [];
            const canceledOrders = canceledRes.ordersToShip || [];
            setDelivered(deliveredOrders.length);
            setCanceled(canceledOrders.length);
            setRevenue(deliveredOrders.reduce((sum, o) => sum + (o.amount || 0), 0));
            setRecentOrders([
                ...deliveredOrders.slice(0, 3).map((o: Order) => ({ ...o, status: "DELIVERED" })),
                ...canceledOrders.slice(0, 2).map((o: Order) => ({ ...o, status: "CANCELED" }))
            ] as Order[]);
            // Monthly chart data
            const monthMap: Record<string, number> = {};
            deliveredOrders.forEach((o: Order) => {
                const d = new Date(o.deliveredAt || o.updatedAt);
                const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                monthMap[key] = (monthMap[key] || 0) + 1;
            });
            setMonthly(Object.entries(monthMap).map(([k, v]) => ({ month: k, count: v })));
            setLoading(false);
        }
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-center mb-2">إحصائيات السائق</h1>
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-success/10 rounded-lg p-3 flex flex-col items-center">
                    <Icon name="CheckCircle" className="h-7 w-7 text-success mb-1" />
                    <span className="text-lg font-bold">{delivered}</span>
                    <span className="text-xs">تم التسليم</span>
                </div>
                <div className="bg-destructive/10 rounded-lg p-3 flex flex-col items-center">
                    <Icon name="XCircle" className="h-7 w-7 text-destructive mb-1" />
                    <span className="text-lg font-bold">{canceled}</span>
                    <span className="text-xs">ملغاة</span>
                </div>
                <div className="bg-info/10 rounded-lg p-3 flex flex-col items-center">
                    <Icon name="BarChart3" className="h-7 w-7 text-info mb-1" />
                    <span className="text-lg font-bold">{revenue.toLocaleString()}</span>
                    <span className="text-xs">الإيرادات</span>
                </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow mt-2">
                <h2 className="text-base font-semibold mb-2 flex items-center gap-2"><Icon name="BarChart3" className="h-5 w-5 text-info" />تسليمات الشهر</h2>
                <div className="flex items-end gap-2 h-24">
                    {monthly.length === 0 && <span className="text-xs text-muted-foreground">لا يوجد بيانات</span>}
                    {monthly.map((m) => (
                        <div key={m.month} className="flex flex-col items-center justify-end">
                            <div className="bg-primary/70 rounded w-6" style={{ height: `${Math.max(10, m.count * 12)}px` }} />
                            <span className="text-[10px] mt-1">{m.month.split('-')[1]}/{m.month.split('-')[0]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow mt-2">
                <h2 className="text-base font-semibold mb-2 flex items-center gap-2"><Icon name="UserCheck" className="h-5 w-5 text-info" />آخر الطلبات</h2>
                <ul className="flex flex-col gap-2">
                    {recentOrders.length === 0 && <li className="text-xs text-muted-foreground">لا يوجد طلبات حديثة</li>}
                    {recentOrders.map((o) => (
                        <li key={o.id} className="flex items-center gap-2 p-2 rounded-lg bg-accent">
                            <Icon name={o.status === "DELIVERED" ? "CheckCircle" : "XCircle"} className={`h-5 w-5 ${o.status === "DELIVERED" ? "text-success" : "text-destructive"}`} />
                            <span className="text-xs font-bold">{o.orderNumber}</span>
                            <span className="text-xs">{o.customer?.name || "-"}</span>
                            <span className="text-xs text-muted-foreground">{new Date(o.updatedAt).toLocaleDateString()}</span>
                            <span className="ml-auto text-xs font-medium">{o.status === "DELIVERED" ? "تم التسليم" : "ملغاة"}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {loading && <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"><Icon name="Loader2" className="animate-spin h-8 w-8 text-primary" /></div>}
        </div>
    );
} 