import { 
  Settings, 
  MapPin, 
  CheckCircle, 
  UserPlus,
  LucideIcon
} from 'lucide-react';

// 🎯 Smart icon picker for system notifications
export function getSystemNotificationIcon(title: string): LucideIcon {
  const titleLower = title.toLowerCase();

  // Welcome/Registration related
  if (titleLower.includes('مرحباً') || titleLower.includes('welcome')) {
    return UserPlus;
  }

  // Address/Location related
  if (titleLower.includes('عنوان') || titleLower.includes('📍') || titleLower.includes('توصيل')) {
    return MapPin;
  }

  // Activation/Verification related
  if (titleLower.includes('فعّل') || titleLower.includes('✅') || titleLower.includes('تفعيل')) {
    return CheckCircle;
  }

  // Account verified
  if (titleLower.includes('تم تفعيل')) {
    return CheckCircle;
  }

  // Default system icon
  return Settings;
}

// 🎨 Get appropriate colors for system notification based on content
export function getSystemNotificationStyle(title: string) {
  const titleLower = title.toLowerCase();

  // Welcome notifications - warm and inviting
  if (titleLower.includes('مرحباً') || titleLower.includes('welcome')) {
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      glowColor: 'border-green-500'
    };
  }

  // Address notifications - blue for location
  if (titleLower.includes('عنوان') || titleLower.includes('📍')) {
    return {
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      glowColor: 'border-blue-500'
    };
  }

  // Activation notifications - orange for action needed
  if (titleLower.includes('فعّل') || titleLower.includes('✅')) {
    return {
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      glowColor: 'border-orange-500'
    };
  }

  // Default gray for other system notifications
  return {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    glowColor: 'border-gray-500'
  };
} 