import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, AlertTriangle, CheckCircle, Edit2, Shield, Lock } from "lucide-react";
import Link from '@/components/link';

export interface UserProfile {
    id: string;
    name?: string | null;
    phone?: string | null;
    isOtp?: boolean | null;
    email?: string | null;
}

interface UserInfoCardProps {
    user: UserProfile;
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
    // Validation logic for each field
    const locationNotVerified = user?.isOtp !== true;
    const missingName = !user?.name;
    const missingPhone = !user?.phone;

    // الآن نركز على البيانات الأساسية فقط، العناوين ستتم إدارتها في AddressBook
    const isValid = !missingName && !missingPhone && !locationNotVerified;

    return (
        <Card className="shadow-lg border-l-4 border-feature-users card-hover-effect card-border-glow">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5 text-feature-users icon-enhanced" />
                    بيانات العميل
                    {isValid && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    {/* Name Field */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-feature-users icon-enhanced" />
                            <span className="text-sm">الاسم:</span>
                        </div>
                        <span className={`text-sm ${missingName ? 'text-destructive' : 'text-green-600'}`}>
                            {user?.name || 'غير مكتمل'}
                        </span>
                    </div>

                    {/* Phone Field */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-feature-users icon-enhanced" />
                            <span className="text-sm">الهاتف:</span>
                        </div>
                        <span className={`text-sm ${missingPhone ? 'text-destructive' : 'text-green-600'}`}>
                            {user?.phone || 'غير مكتمل'}
                        </span>
                    </div>

                    {/* Account Verification */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-feature-users icon-enhanced" />
                            <span className="text-sm">تفعيل الحساب:</span>
                        </div>
                        {locationNotVerified ? (
                            <Link
                                href="/auth/verify?redirect=/checkout"
                                className="text-sm text-destructive hover:underline"
                            >
                                غير مفعل - انقر للتفعيل
                            </Link>
                        ) : (
                            <span className="text-sm text-green-600">✅ مفعل</span>
                        )}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                        {!isValid ? (
                            <div className="space-y-3">
                                <Badge
                                    variant="outline"
                                    className="w-full justify-center border-yellow-400 text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
                                >
                                    <AlertTriangle className="h-4 w-4 mr-2 inline" />
                                    من الأفضل إكمال بياناتك الشخصية لتحسين تجربة التوصيل.
                                </Badge>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full btn-edit border-yellow-400 text-yellow-800 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-600 dark:hover:bg-yellow-900 mt-2"
                                >
                                    <Link href="/user/profile?redirect=/checkout">
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        إكمال الملف الشخصي
                                    </Link>
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                    ملاحظة: العناوين ستتم إدارتها في قسم &quot;عنوان التوصيل&quot; أدناه
                                </p>
                            </div>
                        ) : (
                            <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                جميع البيانات مكتملة
                            </Badge>
                        )}
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t">
                        <Lock className="h-3 w-3 text-feature-users" />
                        <span>معلوماتك آمنة ومشفرة</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 