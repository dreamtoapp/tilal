'use server';

export interface TemplateMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

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
  console.warn(`⚠️ Unknown phone number format: ${phoneNumber}, returning as is`);
  return phoneNumber;
}

// Generate WhatsApp URL for user guidance
export async function generateWhatsAppGuidanceURL(_phoneNumber: string): Promise<string> {
  const businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '+966XXXXXXXXX';
  const message = encodeURIComponent('Hello, I need to register for OTP verification');
  return `https://wa.me/${businessPhone.replace('+', '')}?text=${message}`;
}

// Send OTP using WhatsApp template (approved by Meta)
export async function sendOTPTemplate(
  phoneNumber: string,
  otp: string
): Promise<TemplateMessageResponse> {
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

    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    // Template structure using the working "confirm" template
    const templateStructures = [
      // Structure 1: Arabic "confirm" template (working - tested successfully)
      {
        messaging_product: 'whatsapp',
        to: internationalPhone,
        type: 'template',
        template: {
          name: 'confirm',
          language: {
            code: 'ar'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: otp
                }
              ]
            }
          ]
        }
      }
    ];

    let lastError = '';

    // Try each template structure until one works
    for (let i = 0; i < templateStructures.length; i++) {
      const requestBody = templateStructures[i];

      try {
        console.log(`🔍 Sending template structure ${i + 1}:`, JSON.stringify(requestBody, null, 2));
        console.log(`📱 Phone: ${internationalPhone}`);
        console.log(`🔢 OTP: ${otp}`);
        console.log(`🏷️ Template: confirm`);
        console.log(`🌐 Language: ar`);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log(`📡 WhatsApp API Response (${response.status}):`, JSON.stringify(data, null, 2));

        if (response.ok) {
          console.log(`✅ Template structure ${i + 1} worked!`);
          return { success: true, data };
        } else {
          lastError = data.error?.message || `Structure ${i + 1} failed`;
          console.log(`❌ Template structure ${i + 1} failed:`, lastError);
          console.log(`❌ Full error response:`, JSON.stringify(data, null, 2));

          // Check for specific template approval errors
          if (lastError.includes('Required parameter is missing') ||
            lastError.includes('Template name does not exist') ||
            lastError.includes('Quality pending')) {
            console.log(`⚠️ Template approval issue detected: ${lastError}`);
            // Don't try other structures if it's an approval issue
            break;
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.log(`❌ Template structure ${i + 1} error:`, lastError);
      }
    }

    // If all template structures failed, return the last error
    return { success: false, error: lastError || 'All template structures failed' };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

// Fallback: Send regular text message (only works if user messaged you first)
export async function sendOTPTextMessage(
  phoneNumber: string,
  otp: string
): Promise<TemplateMessageResponse> {
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

    const message = `🔐 رمز التحقق الخاص بك

رمز التحقق: *${otp}*

⏰ هذا الرمز صالح لمدة 10 دقائق فقط

⚠️ لا تشارك هذا الرمز مع أي شخص

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

شكراً لك
إدارة المتجر`;

    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const requestBody = {
      messaging_product: 'whatsapp',
      to: internationalPhone,
      type: 'text',
      text: { body: message },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Text message sent successfully:', data);
      return { success: true, data };
    } else {
      console.log('❌ Text message failed:', data);
      return { success: false, error: data.error?.message || 'Failed to send message' };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
} 