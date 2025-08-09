"use client";
import { useState } from "react";
import Link from '@/components/link';
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";

const LOCALES = [
  { code: "ar-SA", label: "العربية" },
  { code: "en-US", label: "English" },
];

export default function ProductSeoTable({ products }: { products: any[] }) {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary logic
  const summary = LOCALES.map((locale) => {
    let complete = 0,
      incomplete = 0;
    products.forEach((product) => {
      const status = product.seoStatus[locale.code];
      if (status?.hasMetaTitle && status?.hasMetaDescription) complete++;
      else incomplete++;
    });
    return { locale: locale.label, complete, incomplete };
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        {summary.map((s) => (
          <div
            key={s.locale}
            className="bg-muted rounded-lg px-4 py-2 flex flex-col items-center shadow"
          >
            <span className="font-semibold text-primary">{s.locale}</span>
            <span className="text-success-foreground">مكتمل: {s.complete}</span>
            <span className="text-warning-foreground">ناقص: {s.incomplete}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl bg-card shadow">
          <thead>
            <tr className="bg-muted text-foreground">
              <th className="p-3 text-right font-semibold">اسم المنتج</th>
              {LOCALES.map((locale) => (
                <th key={locale.code} className="p-3 text-center font-semibold">
                  {locale.label}
                </th>
              ))}
              <th className="p-3 text-center font-semibold">تعديل</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-b last:border-b-0">
                <td className="p-3 font-medium text-right">{product.name}</td>
                {LOCALES.map((locale) => {
                  const status = product.seoStatus[locale.code];
                  return (
                    <td key={locale.code} className="p-3 text-center">
                      {status?.hasMetaTitle && status?.hasMetaDescription ? (
                        <span className="inline-flex items-center gap-1 text-success-foreground">
                          <CheckCircle className="w-5 h-5" /> مكتمل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-warning-foreground">
                          <AlertTriangle className="w-5 h-5" /> ناقص
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="p-3 text-center">
                  <Link href={`/dashboard/seo/product/${product.id}`}>
                    <Button variant="secondary">تعديل</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
          السابق
        </Button>
        <span>صفحة {page} من {totalPages}</span>
        <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          التالي
        </Button>
      </div>
    </>
  );
}
