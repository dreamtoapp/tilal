interface NotificationProps {
    type: 'order' | 'contact' | 'newsletter';
    title: string;
    message: string;
    onClose: () => void;
}
export default function Notification({ type, title, message, onClose }: NotificationProps) {
    const color = type === 'order' ? '#1976d2' : type === 'contact' ? '#0288d1' : '#43a047';
    return (
        <div style={{ background: color, color: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #0002', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>{type === 'order' ? '🛒' : type === 'contact' ? '💬' : '📧'}</span>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{title}</div>
                <div>{message}</div>
            </div>
            <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>
    );
} 