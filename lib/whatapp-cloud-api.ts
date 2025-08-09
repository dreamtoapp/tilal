'use server';

import { warn } from '@/utils/logger';

export interface SendMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface WhatsAppApiError {
  error: {
    message: string;
    type: string;
    code: number;
  };
}

interface WhatsAppApiSuccess {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

type WhatsAppApiResponse = WhatsAppApiError | WhatsAppApiSuccess;

// Convert local Saudi phone number to international format
function convertToInternationalFormat(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // If it's already in international format (starts with +966), return as is
  if (phoneNumber.startsWith('+966')) {
    return phoneNumber;
  }

  // If it's a local Saudi number (starts with 05 and has 10 digits)
  if (cleaned.startsWith('05') && cleaned.length === 10) {
    // Convert 05XXXXXXXX to +966XXXXXXXXX
    const numberWithoutZero = cleaned.substring(1); // Remove the leading 0
    return `+966${numberWithoutZero}`;
  }

  // If it's already 9 digits (without 05), add +966
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    return `+966${cleaned}`;
  }

  // If it's already in international format without + (starts with 966)
  if (cleaned.startsWith('966') && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // If it's already in international format (starts with + and has 10-15 digits)
  if (phoneNumber.startsWith('+') && cleaned.length >= 10 && cleaned.length <= 15) {
    return phoneNumber;
  }

  // If none of the above patterns match, return the original number
  // This will likely cause an error, but we preserve the original for debugging
  warn(`Unknown phone number format: ${phoneNumber}, returning as is`);
  return phoneNumber;
}

function validatePhoneNumber(phoneNumber: string): boolean {
  // Convert to international format first
  const internationalPhone = convertToInternationalFormat(phoneNumber);

  // Remove all non-digit characters except +
  const cleaned = internationalPhone.replace(/[^\d+]/g, '');

  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+[1-9]\d{10,14}$/;
  return phoneRegex.test(cleaned);
}

function isWhatsAppApiResponse(data: unknown): data is WhatsAppApiResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  if ('error' in data) {
    const errorData = data as WhatsAppApiError;
    return (
      typeof errorData.error === 'object' &&
      typeof errorData.error.message === 'string' &&
      typeof errorData.error.type === 'string' &&
      typeof errorData.error.code === 'number'
    );
  }

  if ('messaging_product' in data) {
    const successData = data as WhatsAppApiSuccess;
    return (
      typeof successData.messaging_product === 'string' &&
      Array.isArray(successData.contacts) &&
      Array.isArray(successData.messages)
    );
  }

  return false;
}

export async function sendMessage(
  phoneNumber: string,
  messageText: string,
): Promise<SendMessageResponse> {
  try {
    const accessToken = process.env.WHATSAPP_PERMANENT_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || 'v23.0';

    if (!accessToken || !phoneNumberId) {
      return { success: false, error: 'Server configuration error' };
    }

    // Convert phone number to international format
    const internationalPhone = convertToInternationalFormat(phoneNumber);
    console.log(`📱 Phone conversion: ${phoneNumber} → ${internationalPhone}`);

    if (!validatePhoneNumber(internationalPhone)) {
      return {
        success: false,
        error: 'Invalid phone number format. Use international format (e.g., +1234567890)',
      };
    }

    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const requestBody = {
      messaging_product: 'whatsapp',
      to: internationalPhone,
      type: 'text',
      text: { body: messageText },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data: unknown = await response.json();

    if (!isWhatsAppApiResponse(data)) {
      return { success: false, error: 'Unexpected API response format' };
    }

    if ('error' in data) {
      return { success: false, error: data.error.message };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}