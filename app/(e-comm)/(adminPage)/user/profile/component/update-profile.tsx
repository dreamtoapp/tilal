'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Award,
  Camera,
  CheckCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormError from '@/components/form-error';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';

import { handleLogout } from '../action/logout';
import { updateUserProfile } from '../action/update-user-profile';
import {
  UserFormData,
  UserSchema,
} from '../helper/userZodAndInputs';
import { ActionAlert } from './ActionAlert';

// Circular Profile Image Component
function CircularProfileImage({
  userData,
  onUploadComplete
}: {
  userData: UserFormData;
  onUploadComplete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(userData.image);
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setLoading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);

    // Upload to server
    const formData = new FormData();
    formData.append('file', selected);
    formData.append('recordId', userData.id);
    formData.append('table', 'user');
    formData.append('tableField', 'image');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setPreview(data.imageUrl);
        onUploadComplete();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل في رفع الصورة');
      setPreview(userData.image); // Revert to original
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden bg-feature-users/10 border-4 border-feature-users/20 cursor-pointer group"
        onClick={handleImageClick}
      >
        {preview ? (
          <Image
            src={preview}
            alt={`${userData.name}'s profile`}
            width={64}
            height={64}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-feature-users/50" />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      <div className="absolute -bottom-1 -right-1 bg-feature-users text-white rounded-full p-1">
        <Camera className="h-3 w-3" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// Profile Header Component (65 lines)
function ProfileHeader({ userData }: { userData: UserFormData }) {
  const completionPercentage = calculateProfileCompletion(userData);
  const router = useRouter();
  const { update } = useSession();

  return (
    <Card className="shadow-lg border-l-4 border-l-feature-users card-hover-effect">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-feature-users icon-enhanced" />
          الملف الشخصي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
          <div className="relative">
            <CircularProfileImage
              userData={userData}
              onUploadComplete={() => {
                toast.success('تم رفع الصورة بنجاح');
                update();
                router.refresh();
              }}
            />
          </div>

          <div className="flex-1 text-center md:text-right space-y-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">{userData.name || 'مستخدم جديد'}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{userData.email}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-1">
              <Badge className=" border-feature-users/20 text-xs" variant={'outline'}>
                <Shield className="h-3 w-3 ml-1" />
                حساب محقق
              </Badge>
              <Badge className="bg-feature-products/10 text-feature-products border-feature-products/20 text-xs " variant={'outline'}>
                <Award className="h-3 w-3 ml-1" />
                عضو ذهبي
              </Badge>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted/30"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${completionPercentage}, 100`}
                  className="text-feature-users"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-feature-users">{completionPercentage}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">اكتمال الملف</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Personal Information Card Component (45 lines)
function PersonalInfoCard({ register, errors, isSubmitting }: {
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  return (
    <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-feature-products icon-enhanced" />
          المعلومات الشخصية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
            <div className="relative">
              <Input
                {...register('name')}
                placeholder="أدخل اسمك الكامل"
                disabled={isSubmitting}
                className="pl-10 h-10 sm:h-11 border-2 focus:border-feature-products transition-colors"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FormError message={errors.name?.message} />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
            <div className="relative">
              <Input
                {...register('phone')}
                placeholder="05XXXXXXXX"
                disabled={isSubmitting}
                maxLength={10}
                className="pl-10 h-10 sm:h-11 border-2 focus:border-feature-products transition-colors"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FormError message={errors.phone?.message} />
          </div>

          <div className="sm:col-span-2 space-y-1 sm:space-y-2">
            <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
            <div className="relative">
              <Input
                {...register('email')}
                type="email"
                placeholder="example@email.com"
                disabled={isSubmitting}
                autoComplete="off"  // ← Add this line here
                className="pl-10 h-10 sm:h-11 border-2 focus:border-feature-products transition-colors"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FormError message={errors.email?.message} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Security Settings Card Component (35 lines)
function SecurityCard({ register, errors, isSubmitting }: {
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  return (
    <Card className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-feature-settings icon-enhanced" />
          إعدادات الأمان
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">كلمة المرور</label>
          <div className="relative">
            <Input
              {...register('password')}
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              disabled={isSubmitting}
              className="pl-10 h-12 border-2 focus:border-feature-settings transition-colors"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <FormError message={errors.password?.message} />
          <p className="text-xs text-muted-foreground">
            يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل
          </p>
        </div>

        <div className="bg-feature-settings/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-feature-products" />
            <span className="text-muted-foreground">تم تفعيل المصادقة الثنائية</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Address Management Card Component
function AddressManagementCard({ hasDefaultAddress, defaultAddress }: { hasDefaultAddress: boolean, defaultAddress?: any }) {
  const router = useRouter();

  return (
    <Card className={`shadow-lg border-l-4 card-hover-effect ${!hasDefaultAddress ? 'border-l-red-500' : 'border-l-feature-suppliers'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className={`h-5 w-5 icon-enhanced ${!hasDefaultAddress ? 'text-red-500' : 'text-feature-suppliers'}`} />
          إدارة العناوين
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasDefaultAddress && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded text-center text-sm font-semibold">
            يجب إضافة عنوان افتراضي لإتمام التوصيل
          </div>
        )}
        {hasDefaultAddress && defaultAddress && (
          <div className="mb-2 p-2 bg-green-50 text-green-800 rounded text-center text-sm font-semibold border border-green-200">
            <div>العنوان الافتراضي الحالي:</div>
            <div className="font-normal text-xs mt-1">
              {defaultAddress.label}، {defaultAddress.district}، {defaultAddress.street}، مبنى {defaultAddress.buildingNumber}
              {defaultAddress.apartmentNumber ? `، شقة ${defaultAddress.apartmentNumber}` : ''}
              {defaultAddress.floor ? `، طابق ${defaultAddress.floor}` : ''}
              {defaultAddress.landmark ? `، معلم: ${defaultAddress.landmark}` : ''}
            </div>
            {defaultAddress.latitude && defaultAddress.longitude && (
              <div className="mt-2">
                <GoogleMapsLink
                  latitude={defaultAddress.latitude}
                  longitude={defaultAddress.longitude}
                  label="عرض على الخريطة"
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-green-800 hover:bg-green-100"
                />
              </div>
            )}
          </div>
        )}
        <div className="text-center space-y-3">
          <div className="bg-feature-suppliers/5 p-4 rounded-lg">
            <MapPin className={`h-8 w-8 mx-auto mb-2 ${!hasDefaultAddress ? 'text-red-500' : 'text-feature-suppliers'}`} />
            <p className="text-sm text-muted-foreground mb-3">
              قم بإدارة عناوينك لتسهيل عملية التوصيل
            </p>
            <Button
              type="button"
              onClick={() => router.push('/user/addresses')}
              className="btn-professional w-full"
            >
              إدارة العناوين
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Preferences Card Component
function PreferencesCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language-preference') || 'ar';
    setSelectedLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (language: string) => {
    if (language === 'en') {
      toast.info('اللغة الإنجليزية ستكون متاحة قريباً');
      return;
    }
    setSelectedLanguage(language);
    localStorage.setItem('language-preference', language);
    toast.success('تم حفظ تفضيل اللغة');
  };

  if (!mounted) {
    return (
      <Card className="shadow-lg border-l-4 border-l-feature-analytics">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-feature-analytics icon-enhanced" />
            التفضيلات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-[70px] rounded-lg" />
              <Skeleton className="h-[70px] rounded-lg" />
              <Skeleton className="h-[70px] rounded-lg" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[46px] rounded-lg" />
              <Skeleton className="h-[46px] rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-feature-analytics icon-enhanced" />
          التفضيلات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">المظهر</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { value: 'light', label: 'فاتح', icon: '☀️' },
              { value: 'dark', label: 'داكن', icon: '🌙' },
              { value: 'system', label: 'النظام', icon: '💻' }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${theme === item.value
                  ? 'border-feature-analytics bg-feature-analytics/10 ring-2 ring-feature-analytics/20'
                  : 'border-border hover:border-feature-analytics/50'
                  }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-base sm:text-lg">{item.icon}</div>
                  <div className="text-xs font-medium">{item.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">اللغة</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              { value: 'ar', label: 'العربية', flag: '🇸🇦', available: true },
              { value: 'en', label: 'English', flag: '🇺🇸', available: false }
            ].map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleLanguageChange(lang.value)}
                disabled={!lang.available}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${selectedLanguage === lang.value
                  ? 'border-feature-analytics bg-feature-analytics/10 ring-2 ring-feature-analytics/20'
                  : lang.available
                    ? 'border-border hover:border-feature-analytics/50 hover:scale-105'
                    : 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base sm:text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                  {!lang.available && (
                    <span className="text-xs text-muted-foreground">(قريباً)</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-feature-analytics/5 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            💡 يتم حفظ تفضيلات المظهر واللغة تلقائياً في متصفحك.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Profile Actions Component
function ProfileActions({ isSubmitting, onReset }: {
  isSubmitting: boolean;
  onReset: () => void;
}) {
  return (
    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 bg-feature-users hover:bg-feature-users/90 text-white font-medium btn-professional"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                جارٍ الحفظ...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isSubmitting}
            className="sm:w-32 h-12 btn-cancel-outline"
          >
            إعادة تعيين
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          سيتم حفظ التغييرات تلقائياً وإعادة تحميل الصفحة
        </p>
      </CardContent>
    </Card>
  );
}

// Logout Card Component
function LogoutCard() {
  return (
    <Card className="shadow-lg border-l-4 border-l-destructive card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <LogOut className="h-5 w-5 text-destructive icon-enhanced" />
          تسجيل الخروج
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleLogout}>
          <Button
            type="submit"
            className="w-full btn-delete"
          >
            تأكيد الخروج
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-3">
          سيتم إنهاء جلستك وتوجيهك لصفحة تسجيل الدخول.
        </p>
      </CardContent>
    </Card>
  );
}

// Helper function
function calculateProfileCompletion(userData: UserFormData): number {
  const fields = ['name', 'email', 'phone', 'image'];
  const completedFields = fields.filter(field => userData[field as keyof UserFormData]);
  return Math.round((completedFields.length / fields.length) * 100);
}

// Main Profile Component
export default function UserProfileForm({
  userData,
  isOtp,
  hasDefaultAddress,
  defaultAddress,
}: {
  userData: UserFormData;
  isOtp: boolean;
  hasDefaultAddress: boolean;
  defaultAddress?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const { update } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange',
    defaultValues: {
      id: userData.id ?? '',
      name: userData.name ?? '',
      phone: userData.phone ?? '',
      email: userData.email ?? '',
      password: userData.password ?? '',
      image: userData.image ?? '',
    },
  });

  // console.log("[DEBUG ] User data:", userData.email);

  const onSubmit = async (formData: UserFormData) => {
    try {
      const result = await updateUserProfile({ ...formData });
      if (result.ok) {
        toast.success(result.msg || 'تم تحديث المعلومات بنجاح');
        await update();
        router.refresh();
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
      } else {
        // Handle validation errors
        if (result.errors && Object.keys(result.errors).length > 0) {
          // Set form errors for specific fields
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof UserFormData, {
                type: 'server',
                message: messages[0],
              });
            }
          });
        }
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('فشل في إرسال البيانات:', err);
    }
  };

  const handleReset = () => {
    const formValues: UserFormData = {
      id: userData.id ?? '',
      name: userData.name ?? '',
      email: userData.email ?? '',
      phone: userData.phone ?? '',
      password: '',
      image: userData.image ?? '',
    };
    reset(formValues);
    toast.info('تمت إعادة تعيين الحقول إلى قيمها الأصلية.');
  };

  return (
    <div className="min-h-screen bg-muted/30 py-1 sm:py-2">
      <div className="container mx-auto px-2 sm:px-3 max-w-4xl space-y-2 sm:space-y-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
          <ProfileHeader userData={userData} />

          <div className='space-y-2'>
            {!isOtp && (
              <ActionAlert
                variant='destructive'
                title='حساب غير مفعل'
                description='تفعيل حسابك مطلوب للوصول الكامل إلى ميزات التطبيق وتقديم الطلبات.'
                buttonText='الانتقال إلى التفعيل'
                onAction={() => router.push('/auth/verify')}
              />
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-2 sm:gap-3">
            <div className="space-y-2 sm:space-y-3">
              <PersonalInfoCard
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <SecurityCard
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <AddressManagementCard hasDefaultAddress={hasDefaultAddress} defaultAddress={defaultAddress} />
              <PreferencesCard />
            </div>
          </div>

          <ProfileActions
            isSubmitting={isSubmitting}
            onReset={handleReset}
          />
        </form>

        <LogoutCard />
      </div>
    </div>
  );
}
