import Link from 'next/link';

export default function DashboardFooter() {
    return (
        <footer className='border-t bg-background/80 backdrop-blur-sm px-4 md:px-6 py-4 mt-auto'>
            <div className='flex items-center justify-center text-sm text-muted-foreground'>
                <Link
                    href="https://dreamto.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                    title="DreamTo.App - تحويل الأفكار إلى تطبيقات"
                >
                    <span>🚀</span>
                    <span>DreamTo.App</span>
                    <span>✨</span>
                </Link>
            </div>
        </footer>
    );
} 