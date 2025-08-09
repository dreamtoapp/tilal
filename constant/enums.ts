export enum Directions {
  RTL = 'rtl',
  LTR = 'ltr',
}

export enum Languages {
  ENGLISH = 'en',
  ARABIC = 'ar',
}

export enum homeSections {
  SERVICE = 'service',
  TECHNOLOGY = 'technology',
  SUPPORT = 'support',
  FREE = 'free',
  BLOG = 'blog',
}

export enum Routes {
  ROOT = '/',
  MENU = 'menu',
  ABOUT = 'about',
  CONTACT = 'contact',
  AUTH = 'auth',
  CART = 'cart',
}

export enum Pages {
  LOGIN = 'signin',
  Register = 'signup',
}

export enum InputTypes {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  DATE_TIME_LOCAL = 'datetime-local',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  FILE = 'file',
  IMAGE = 'image',
  COLOR = 'color',
  RANGE = 'range',
  TEL = 'tel',
  URL = 'url',
  SEARCH = 'search',
  MONTH = 'month',
  WEEK = 'week',
  HIDDEN = 'hidden',
  MULTI_SELECT = 'multi select',
}

export enum Navigate {
  NEXT = 'next',
  PREV = 'prev',
}
export enum Responses {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  STATUS = 'status',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export enum AuthMessages {
  LOGIN_SUCCESS = 'Login successfully',
  LOGOUT_SUCCESS = 'Logout successfully',
  REGISTER_SUCCESS = 'Register successfully',
  FORGET_PASSWORD_SUCCESS = 'Forget password successfully',
  RESET_PASSWORD_SUCCESS = 'Reset password successfully',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum Environments {
  PROD = 'production',
  DEV = 'development',
}
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER'
}

export enum questionQueryMode {
  QUESTIONS = 'questions',
  ANSWERS = 'answers',
}

export enum questionStatus {
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ANSWERED = 'answered',
  PENDING = 'pending',
}

export enum RatingType {
  PURCHASE = 'PURCHASE',      // The overall buying/checkout experience
  DELIVERY = 'DELIVERY',      // Delivery/shipping experience
  SUPPORT = 'SUPPORT',        // Customer support experience
  APP = 'APP',                // App/platform experience
  PRODUCT = 'PRODUCT',        // Product-specific rating (for future extensibility)
  OTHER = 'OTHER',            // Any other feedback
}
