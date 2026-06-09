import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWorker, saveFCMToken } from '../services/api';
import { requestNotificationPermission } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [workerName, setWorkerName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call Flow 2: Validate login
      const loginResponse = await loginWorker(workerName, pin);

      if (loginResponse.success) {
        // Store worker info
        localStorage.setItem('worker', JSON.stringify({
          id: loginResponse.worker.id,
          name: loginResponse.worker.name
        }));

        // Request notification permission and get FCM token
        const fcmToken = await requestNotificationPermission();
        
        if (fcmToken) {
          // Call Flow 3: Save FCM token
          await saveFCMToken(workerName, fcmToken);
          localStorage.setItem('fcmToken', fcmToken);
        }

        // Navigate to pending requests
        navigate('/requests');
      } else {
        setError('Invalid name or PIN. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your details and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pantry Worker Portal</h1>
        <p style={styles.subtitle}>Login to accept requests</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Worker Name</label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              placeholder="Enter your name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.hint}>
          📱 Notifications will be enabled after login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%'
  },
  title: {
    textAlign: 'center',
    color: '#16a34a',
    fontSize: '28px',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit'
  },
  button: {
    padding: '12px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '10px'
  },
  hint: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginTop: '20px'
  }
};