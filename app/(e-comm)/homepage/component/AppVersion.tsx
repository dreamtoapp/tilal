import pkg from '../../../../package.json';

const APP_VERSION = pkg?.version || 'v1.0.0';

export default function AppVersion() {
    return (
        <div className="text-xs text-muted-foreground text-center py-2 select-none">
            إصدار التطبيق: <span className="font-mono">{APP_VERSION}</span>
        </div>
    );
} 