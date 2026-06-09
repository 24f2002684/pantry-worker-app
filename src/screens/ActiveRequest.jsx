import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { markDelivered, submitDelayReason } from '../services/api';

export default function ActiveRequest() {
  const navigate = useNavigate();
  const request = JSON.parse(localStorage.getItem('activeRequest') || '{}');
  const worker = JSON.parse(localStorage.getItem('worker') || '{}');

  const [isLate, setIsLate] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showDelayForm, setShowDelayForm] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate time remaining
  useEffect(() => {
    const timer = setInterval(() => {
      if (request.acceptedAt && request.eta) {
        const acceptedTime = new Date(request.acceptedAt);
        const etaMs = request.eta * 60 * 1000;
        const dueTime = new Date(acceptedTime.getTime() + etaMs);
        const now = new Date();
        const remaining = dueTime - now;

        if (remaining <= 0) {
          setIsLate(true);
          setTimeRemaining('OVERDUE');
        } else {
          setIsLate(false);
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [request]);

  const handleDeliver = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await markDelivered(request.ID, worker.name);

      if (response.success) {
        localStorage.removeItem('activeRequest');
        navigate('/requests');
      } else {
        setError('Failed to mark as delivered');
      }
    } catch (err) {
      setError('Error marking delivery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await submitDelayReason(request.ID, delayReason);

      if (response.success) {
        setShowDelayForm(false);
        setDelayReason('');
      } else {
        setError('Failed to submit delay reason');
      }
    } catch (err) {
      setError('Error submitting delay reason');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Active Request</h2>

        <div
          style={{
            ...styles.statusBar,
            backgroundColor: isLate ? '#fef2f2' : '#f0fdf4',
            borderColor: isLate ? '#fca5a5' : '#86efac'
          }}
        >
          <span style={{ color: isLate ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
            {isLate ? '⚠️ OVERDUE' : '✓ ON TIME'}
          </span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: isLate ? '#dc2626' : '#16a34a' }}>
            {timeRemaining}
          </span>
        </div>

        <div style={styles.details}>
          <p>
            <strong>Request ID:</strong> {request.Title}
          </p>
          <p>
            <strong>Item:</strong> {request.Item} x{request.Quantity}
          </p>
          <p>
            <strong>Location:</strong> {request.RoomName}
          </p>
          <p>
            <strong>Requested by:</strong> {request.EmployeeName}
          </p>
          <p>
            <strong>Your ETA:</strong> {request.eta} minutes
          </p>
          <p>
            <strong>Accepted at:</strong>{' '}
            {new Date(request.acceptedAt).toLocaleTimeString()}
          </p>
        </div>

        {isLate && !showDelayForm && (
          <div style={styles.lateWarning}>
            <p>
              ⚠️ You are running late. Please provide a reason for the delay.
            </p>
            <button
              onClick={() => setShowDelayForm(true)}
              style={styles.delayReasonBtn}
            >
              Submit Delay Reason
            </button>
          </div>
        )}

        {showDelayForm && (
          <form onSubmit={handleSubmitDelay} style={styles.delayForm}>
            <h3 style={styles.delayTitle}>Why are you delayed?</h3>
            <textarea
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              placeholder="Enter reason for delay..."
              style={styles.textarea}
              required
            />
            <div style={styles.delayButtonGroup}>
              <button
                type="button"
                onClick={() => setShowDelayForm(false)}
                style={styles.cancelDelayBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitDelayBtn,
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit Reason'}
              </button>
            </div>
          </form>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleDeliver}
          disabled={loading}
          style={{
            ...styles.deliverBtn,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Processing...' : '✓ Mark as Delivered'}
        </button>

        <button
          onClick={() => navigate('/requests')}
          style={styles.backBtn}
        >
          Back to Requests
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 20px 0',
    color: '#16a34a',
    fontSize: '24px'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid',
    marginBottom: '20px'
  },
  details: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  lateWarning: {
    backgroundColor: '#fef2f2',
    border: '2px solid #fca5a5',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  delayReasonBtn: {
    width: '100%',
    padding: '10px',
    marginTop: '12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  delayForm: {
    backgroundColor: '#fef2f2',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  delayTitle: {
    margin: '0 0 12px 0',
    color: '#333'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    minHeight: '100px',
    fontFamily: 'inherit',
    marginBottom: '12px',
    boxSizing: 'border-box'
  },
  delayButtonGroup: {
    display: 'flex',
    gap: '12px'
  },
  cancelDelayBtn: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  submitDelayBtn: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  deliverBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '12px'
  },
  backBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};