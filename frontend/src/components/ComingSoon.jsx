export default function ComingSoon({ title, description }) {
    return (
        <div className="tab-pane">
            <h2 style={{ color: 'var(--admin-text-primary)', fontSize: '1.8rem', marginBottom: '4px' }}>{title}</h2>
            <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '24px' }}>{description}</p>
            <div style={{
                padding: '24px',
                background: 'var(--admin-card)',
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--admin-text-muted)',
                fontSize: '0.9rem'
            }}>
                This feature is currently under development and will be available soon.
            </div>
        </div>
    )
}