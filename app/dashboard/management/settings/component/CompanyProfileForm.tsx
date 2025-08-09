"use client"

import { useState } from "react"
import { LocateFixed, MapPin, Building2, FileText, MapIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import useGeolocation from "@/hooks/use-geo"
import { cn } from "@/lib/utils"
import { saveCompany } from "../actions/saveCompnay"
import { type CompanyFormData, CompanySchema, getCompanyFields } from "../helper/companyZodAndInputs"
import AddImage from "@/components/AddImage"

interface CompanyProfileFormProps {
  company?: CompanyFormData | null
}

export default function CompanyProfileForm({ company }: CompanyProfileFormProps) {
  const [coordsApproved, setCoordsApproved] = useState(false)
  const currentStep = 0

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    getValues,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(CompanySchema),
    defaultValues: company ?? {},
  })

  const { latitude, longitude, accuracy, googleMapsLink, loading } = useGeolocation()

  const handleApproveCoords = () => {
    if (latitude && longitude) {
      reset({
        ...getValues(),
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      })
      setCoordsApproved(true)
      toast.success("تم تحديث الإحداثيات بنجاح")
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    try {
      await saveCompany(data)
      toast.success("تم حفظ بيانات الشركة بنجاح ✅")
    } catch (error) {
      console.error("❌ Failed to save company:", error)
      toast.error("حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.")
    }
  }

  const GeolocationCard = () => (
    <Card className="border-2 border-dashed border-muted-foreground/25 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : coordsApproved ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <LocateFixed className="w-5 h-5 text-blue-500" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">تحديد الموقع التلقائي</h4>
              <p className="text-xs text-muted-foreground">احصل على إحداثيات دقيقة لموقع شركتك</p>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : latitude && longitude ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="font-mono">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </Badge>
                  {accuracy && <span className="text-muted-foreground">دقة: ~{accuracy.toFixed(0)}م</span>}
                </div>

                {googleMapsLink && (
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    عرض على خرائط Google
                  </a>
                )}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  لم يتم العثور على الموقع. تأكد من السماح بالوصول للموقع.
                </AlertDescription>
              </Alert>
            )}

            {!loading && !coordsApproved && latitude && longitude && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleApproveCoords}
                className="w-full h-8 text-xs"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                استخدام هذه الإحداثيات
              </Button>
            )}

            {coordsApproved && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                تم تحديث الإحداثيات بنجاح
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const sections = getCompanyFields(register, errors)

  const sectionIcons = {
    "المعلومات الأساسية": Building2,
    "الوصف والموقع": MapIcon,
    "معلومات إضافية": FileText,
    "معلومات ضريبية": FileText,
  }

  const locationSection = sections.find((s) => s.section === "الوصف والموقع")
  if (locationSection) {
    locationSection.customContent = (
      <div className="space-y-4">
        <GeolocationCard />
        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">ملف الشركة</h1>
        <p className="text-muted-foreground">أدخل معلومات شركتك بدقة لضمان أفضل تجربة</p>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {sections.map((_, index) => (
            <div
              key={index}
              className={cn("w-2 h-2 rounded-full transition-colors", index <= currentStep ? "bg-primary" : "bg-muted")}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {sections.map(({ section, fields, hint, customContent, hasImage }) => {
          const IconComponent = sectionIcons[section as keyof typeof sectionIcons] || Building2

          return (
            <Card key={section} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  {section}
                </CardTitle>
                {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
              </CardHeader>

              <CardContent className={cn("space-y-6", hasImage ? "grid md:grid-cols-3 gap-6" : "")}>
                {customContent && <div className="md:col-span-3">{customContent}</div>}

                {hasImage && (
                  <div className="md:col-span-1">
                    <AddImage
                      url={company?.taxQrImage || ''}
                      alt={`${company?.fullName || 'الشركة'} شعار`}
                      recordId={company?.id || ''}
                      table="company"
                      tableField="taxQrImage"
                    />
                  </div>
                )}

                <div className={cn("space-y-6", hasImage ? "md:col-span-2" : "")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map(({ name, type, placeholder, register, error, fullWidith }) => (
                      <div
                        key={name}
                        className={cn("space-y-2", fullWidith && "md:col-span-2")}
                      >
                        <Label htmlFor={name} className="text-sm font-medium text-foreground flex items-center gap-2">
                          {placeholder}
                          {error && <AlertCircle className="w-3 h-3 text-destructive" />}
                        </Label>

                        <Input
                          id={name}
                          type={type}
                          placeholder={`أدخل ${placeholder}`}
                          {...register}
                          className={cn(
                            "transition-all duration-200",
                            error
                              ? "border-destructive ring-2 ring-destructive/20"
                              : "focus:ring-2 focus:ring-primary/20"
                          )}
                        />

                        {error && (
                          <div className="flex items-center gap-2 text-xs text-destructive">
                            <AlertCircle className="w-3 h-3" />
                            {error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        <Separator className="my-8" />

        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <h3 className="font-medium">جاهز للحفظ؟</h3>
                <p className="text-sm text-muted-foreground">تأكد من صحة جميع البيانات قبل الحفظ</p>
              </div>

              <div className="flex gap-3">
                {isDirty && (
                  <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
                    إعادة تعيين
                  </Button>
                )}

                <Button type="submit" disabled={isSubmitting} className="min-w-32 h-10">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جارٍ الحفظ...
                    </>
                  ) : (
                    "حفظ البيانات"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
