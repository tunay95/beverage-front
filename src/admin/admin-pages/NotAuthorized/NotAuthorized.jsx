import { Link } from 'react-router-dom';

export default function NotAuthorized() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>403</h1>
            <h2 style={{ marginBottom: '1rem' }}>Unauthorized Access</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                You do not have permission to access this page.
            </p>
            <Link 
                to="/auth/login" 
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#aa0707ff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px'
                }}
            >
                Go to Login
            </Link>
        </div>
    );
}