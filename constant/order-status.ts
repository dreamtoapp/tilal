export const ORDER_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_STYLES = {
  [ORDER_STATUS.PENDING]: 'warning-soft-bg warning-fg',
  [ORDER_STATUS.ASSIGNED]: 'info-soft-bg info-fg',
  [ORDER_STATUS.IN_TRANSIT]: 'info-soft-bg info-fg',
  [ORDER_STATUS.DELIVERED]: 'success-soft-bg success-fg',
  [ORDER_STATUS.CANCELED]: 'danger-soft-bg danger-fg',
};

export const ORDER_STATUS_DISPLAY_AR = {
  [ORDER_STATUS.PENDING]: 'قيد الانتظار',
  [ORDER_STATUS.ASSIGNED]: 'مُخصص',
  [ORDER_STATUS.IN_TRANSIT]: 'قيد التوصيل',
  [ORDER_STATUS.DELIVERED]: 'تم التوصيل',
  [ORDER_STATUS.CANCELED]: 'ملغي',
};
