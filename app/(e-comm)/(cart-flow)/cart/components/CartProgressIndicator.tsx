import { ArrowLeft } from "lucide-react";

export default function CartProgressIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-feature-commerce text-white flex items-center justify-center text-sm font-bold">1</div>
        <span className="font-medium text-feature-commerce">مراجعة السلة</span>
      </div>
      <ArrowLeft className="h-4 w-4 text-muted-foreground mx-2" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-sm">2</div>
        <span className="text-muted-foreground">الدفع</span>
      </div>
      <ArrowLeft className="h-4 w-4 text-muted-foreground mx-2" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-sm">3</div>
        <span className="text-muted-foreground">التأكيد</span>
      </div>
    </div>
  );
} 