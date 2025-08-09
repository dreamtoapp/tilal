// 📱 Client-side error logger (safe for browser use)
// Uses API calls instead of direct server imports

export interface ClientErrorContext {
  url?: string;
  digest?: string;
  additionalInfo?: string;
}

// 📝 Log error from client-side components
export async function logClientError(
  error: Error,
  context?: ClientErrorContext
): Promise<string> {
  try {
    const response = await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        digest: context?.digest,
        url: context?.url || (typeof window !== 'undefined' ? window.location.href : 'Unknown'),
        additionalInfo: context?.additionalInfo
      })
    });
    
    const data = await response.json();
    return data.errorId || `ERR-${Date.now()}`;
    
  } catch (logError) {
    console.error('Failed to log error via API:', logError);
    return `ERR-${Date.now()}`;
  }
}

// 🎯 Quick error logging for specific error types (client-side)
export const CLIENT_ERROR_LOGGER = {
  // Form errors
  form: (error: Error, formName?: string) => 
    logClientError(error, { additionalInfo: `Form: ${formName}` }),
  
  // Component errors  
  component: (error: Error, componentName?: string) =>
    logClientError(error, { additionalInfo: `Component: ${componentName}` }),
  
  // User action errors
  action: (error: Error, actionName?: string) =>
    logClientError(error, { additionalInfo: `User action: ${actionName}` }),
  
  // Network errors
  network: (error: Error, endpoint?: string) =>
    logClientError(error, { additionalInfo: `Network call: ${endpoint}` })
}; 