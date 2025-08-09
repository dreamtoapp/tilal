// WhatsApp Cloud API Configuration
export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
  businessAccountId: string;
  webhookVerifyToken: string;
  appSecret: string;
  environment: string;
}

// Validate WhatsApp configuration
export function validateWhatsAppConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const requiredVars = [
    'WHATSAPP_PERMANENT_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_BUSINESS_ACCOUNT_ID',
    'WHATSAPP_WEBHOOK_VERIFY_TOKEN',
    'WHATSAPP_APP_SECRET'
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Get WhatsApp configuration
export function getWhatsAppConfig(): WhatsAppConfig {
  const validation = validateWhatsAppConfig();

  if (!validation.isValid) {
    throw new Error(`WhatsApp configuration error: ${validation.errors.join(', ')}`);
  }

  return {
    accessToken: process.env.WHATSAPP_PERMANENT_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v23.0',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN!,
    appSecret: process.env.WHATSAPP_APP_SECRET!,
    environment: process.env.WHATSAPP_ENVIRONMENT || 'production'
  };
}

// Build API endpoint
export function buildApiEndpoint(path: string): string {
  const config = getWhatsAppConfig();
  return `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}${path}`;
}

// Get API headers
export function getApiHeaders(): Record<string, string> {
  const config = getWhatsAppConfig();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.accessToken}`,
  };
} 