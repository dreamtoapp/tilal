'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorId, setErrorId] = useState<string>('');
  const [isLogging, setIsLogging] = useState(true);

  useEffect(() => {
    // Log error via API (server-side will handle email)
    const logError = async () => {
      try {
        const response = await fetch('/api/log-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            url: window?.location?.href
          })
        });

        const data = await response.json();
        setErrorId(data.errorId);
      } catch (logError) {
        setErrorId(`ERR-${Date.now()}`);
      } finally {
        setIsLogging(false);
      }
    };

    logError();
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          backgroundAttachment: 'fixed'
        }}>
          {/* 🔧 Animated Icon */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            animation: 'bounce 2s infinite',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}>
            🔧
          </div>

          {/* 📱 Loading Animation */}
          {isLogging && (
            <div style={{
              marginBottom: '1rem',
              fontSize: '0.9rem',
              opacity: '0.8'
            }}>
              📝 جاري تسجيل المشكلة...
            </div>
          )}

          {/* 🎯 Main Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #fff, #f0f8ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🛠️ صيانة مؤقتة
          </h1>

          <h2 style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            opacity: '0.9',
            fontWeight: '400'
          }}>
            We&apos;re working on fixing this issue
          </h2>

          {/* 🎯 Reassuring Message */}
          <div style={{
            maxWidth: '600px',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              😊 <strong>لا تقلق!</strong> هذا أمر طبيعي وسيتم حله قريباً
            </p>
            <p style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
              Don&apos;t worry! This is normal and will be resolved shortly.
              Our team has been automatically notified.
            </p>
          </div>

          {/* 🆔 Error Reference ID */}
          <div style={{
            marginBottom: '2rem',
            padding: '1rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            minWidth: '280px'
          }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: '0.8' }}>
              📸 للمساعدة السريعة، اذكر هذا الرقم:
            </p>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', opacity: '0.7' }}>
              For quick help, mention this ID:
            </p>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.8rem',
              borderRadius: '6px',
              letterSpacing: '1px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              marginTop: '0.5rem'
            }}>
              {errorId || 'جاري التحميل...'}
            </div>
          </div>

          {/* 🔄 Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <Button
              onClick={reset}
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '25px',
                color: 'white',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.3)';
                target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.2)';
                target.style.transform = 'translateY(0)';
              }}
            >
              🔄 إعادة المحاولة
            </Button>

            <Link
              href="/"
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '25px',
                color: 'white',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.3)';
                target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.2)';
                target.style.transform = 'translateY(0)';
              }}
            >
              🏠 العودة للرئيسية
            </Link>
          </div>

          {/* ⚡ Technical Info (Collapsible) */}
          <details style={{
            marginTop: '1rem',
            maxWidth: '500px',
            opacity: '0.7'
          }}>
            <summary style={{
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            }}>
              🔧 تفاصيل تقنية (للمطورين)
            </summary>
            <div style={{
              fontSize: '0.8rem',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '6px',
              textAlign: 'left',
              fontFamily: 'monospace',
              marginTop: '0.5rem',
              wordBreak: 'break-all'
            }}>
              <p><strong>Message:</strong> {error.message}</p>
              {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
              <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
            </div>
          </details>

          {/* 💬 Footer Message */}
          <div style={{
            marginTop: '2rem',
            fontSize: '0.8rem',
            opacity: '0.6',
            maxWidth: '400px',
            lineHeight: '1.4'
          }}>
            💡 نقدر صبرك ونعمل على حل المشكلة في أقرب وقت ممكن
          </div>
        </div>

        {/* 🎨 CSS Animation */}
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-20px);
            }
            60% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </body>
    </html>
  );
}
