'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import InfoTooltip from '@/components/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@/components/icons/Icon';
import {
  extractCoordinatesFromUrl,
} from '@/utils/extract-latAndLog-fromWhatsAppLink';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@prisma/client';

import { upsertUser } from '../actions/upsertUser';
import {
  getDriverFields,
  UserFormData,
  UserSchema,
} from '../helper/userZodAndInputs';

interface userProps {
  role: UserRole;
  mode: 'new' | 'update'
  defaultValues: UserFormData;
  title?: string;
  description?: string;
}

export default function AddUser({ role, mode, defaultValues, title, description }: userProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['البيانات الشخصية']));

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange',
    defaultValues: {
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      address: defaultValues.address || '',
      password: defaultValues.password || '',
      sharedLocationLink: defaultValues.sharedLocationLink || '',
      latitude: defaultValues.latitude || '',
      longitude: defaultValues.longitude || '',
      vehicleType: defaultValues.vehicleType || undefined,
      vehiclePlateNumber: defaultValues.vehiclePlateNumber || '',
      vehicleColor: defaultValues.vehicleColor || '',
      vehicleModel: defaultValues.vehicleModel || '',
      driverLicenseNumber: defaultValues.driverLicenseNumber || '',
      experience: defaultValues.experience || '',
      maxOrders: defaultValues.maxOrders || '',
    },
  });

  const onSubmit = async (formData: UserFormData) => {
    try {
      const finalData = {
        ...formData,
        role: role,
      };

      const result = await upsertUser(finalData, role, mode);

      if (result.ok) {
        toast.success(result.msg || 'تم إضافة السائق بنجاح');
        reset();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('فشل في إرسال البيانات:', err);
    }
  };

  const handleExtractCoordinates = () => {
    const input = getValues('sharedLocationLink');
    const coords = extractCoordinatesFromUrl(input || '');

    if (coords) {
      setValue('latitude', coords.lat.toString());
      setValue('longitude', coords.lng.toString());
      toast.success('تم استخراج الإحداثيات بنجاح');
    } else {
      toast.error('تعذر استخراج الإحداثيات من الرابط');
    }
  };

  const handleOpenWhatsApp = () => {
    const input = getValues('sharedLocationLink');
    if (input) {
      window.open(input, '_blank');
    }
  };

  const isWhatsAppLinkValid = () => {
    const url = getValues('sharedLocationLink');
    return url?.startsWith('https://wa.me/') || url?.includes('google.com/maps');
  };

  return (
    <AppDialog
      trigger={<Button variant={mode === "new" ? 'default' : 'outline'} size='sm' className='flex items-center gap-2'>
        {mode === 'new' ? (
          <>
            <Icon name="Plus" size="xs" /> <span>إضافة</span>
          </>
        ) : (
          <>
            <Icon name="Edit" size="xs" /> <span>تعديل</span>
          </>
        )}

      </Button>}
      title={title}
      description={description}
      mode={mode}
      footer={
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
          form="user-form"
        >
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
        </Button>
      }
    >
      <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {getDriverFields(register, errors).map((section) => {
          const isExpanded = expandedSections.has(section.section);

          return (
            <div key={section.section} className="border rounded-lg">
              <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleSection(section.section)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {section.section}
                  </h3>
                  {!isExpanded && (
                    <span className="text-xs text-gray-500">({section.fields.length} حقول)</span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  {section.hint && (
                    <InfoTooltip content="يمكنك الحصول على خط العرض والطول من خلال مشاركة الموقع معك من خرائط Google أو أي تطبيق GPS آخر." />
                  )}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.section)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <Icon name="ChevronUp" className="h-4 w-4" />
                    ) : (
                      <Icon name="ChevronDown" className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-3">
                  <div className="grid grid-cols-1 gap-4">
                    {section.fields.map((field) => {
                      if (field.name === 'sharedLocationLink') {
                        return (
                          <div
                            key={field.name}
                            className="flex gap-2 items-start"
                          >
                            <div className="flex-1">
                              <Input
                                {...field.register}
                                type={field.type}
                                placeholder={field.placeholder}
                                disabled={isSubmitting}
                              />
                              <FormError message={field.error} />
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleExtractCoordinates}
                                disabled={isSubmitting || !isWhatsAppLinkValid()}
                              >
                                <Icon name="LocateFixed" />
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={handleOpenWhatsApp}
                                disabled={!isWhatsAppLinkValid()}
                              >
                                <Icon name="MapPin" />
                              </Button>
                              <InfoTooltip content="  يمكنك نسخ رابط مشاركة الموقع من WhatsApp أو خرائط Google وسنقوم باستخراج الإحداثيات تلقائياً." />
                            </div>
                          </div>
                        );
                      }

                      // Handle select fields (like vehicle type)
                      if (field.type === 'select' && field.options) {
                        return (
                          <div key={field.name} className={field.className}>
                            <Select
                              onValueChange={(value) => setValue(field.name as any, value)}
                              defaultValue={getValues(field.name as any)}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormError message={field.error} />
                          </div>
                        );
                      }

                      return (
                        <div key={field.name} className={field.className}>
                          <Input
                            {...field.register}
                            type={field.type}
                            placeholder={field.placeholder}
                            disabled={isSubmitting}
                            maxLength={field.maxLength}
                          />
                          <FormError message={field.error} />
                        </div>
                      );
                    })}
                  </div>

                  {section.hint && (
                    <p className="text-xs text-muted-foreground text-right max-w-md">

                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </form>
    </AppDialog>
  );
}
