import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptRequest } from '../services/api';

export default function AcceptRequest() {
  const navigate = useNavigate();
  const request = JSON.parse(localStorage.getItem('selectedRequest') || '{}');
  const worker = JSON.parse(localStorage.getItem('worker') || '{}');

  const [eta, setEta] = useState('10');
  const [customEta, setCustomEta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const etaOptions = ['5', '10', '15', '20', '30'];

  const handleAccept = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const etaMinutes = eta === 'custom' ? customEta : eta;

      if (!etaMinutes || parseInt(etaMinutes) <= 0) {
        setError('Please enter a valid ETA');
        setLoading(false);
        return;
      }

      // Call Flow 5: Accept Request
      const response = await acceptRequest(
        request.ID,
        worker.name,
        etaMinutes
      );

      if (response.success) {
        // Store active request
        localStorage.setItem('activeRequest', JSON.stringify({
          ...request,
          assignedWorker: worker.name,
          eta: etaMinutes,
          acceptedAt: new Date().toISOString()
        }));

        navigate('/active');
      } else {
        setError(
          response.message || 'Another worker already accepted this request'
        );
      }
    } catch (err) {
      setError('Failed to accept request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/requests');
  };

  return (
    <div style={styles.container}>
      <button onClick={handleCancel} style={styles.backBtn}>
        ← Back
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Accept Request</h2>

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
        </div>

        <form onSubmit={handleAccept} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Estimated Time of Arrival (in minutes)
            </label>

            <div style={styles.etaOptions}>
              {etaOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setEta(option)}
                  style={{
                    ...styles.etaBtn,
                    backgroundColor: eta === option ? '#16a34a' : '#f3f4f6',
                    color: eta === option ? 'white' : '#333',
                    borderColor: eta === option ? '#16a34a' : '#e5e7eb'
                  }}
                >
                  {option} min
                </button>
              ))}
            </div>

            <div style={styles.customEta}>
              <label>
                <input
                  type="radio"
                  name="eta"
                  value="custom"
                  checked={eta === 'custom'}
                  onChange={(e) => setEta(e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                Custom:
              </label>
              <input
                type="number"
                value={customEta}
                onChange={(e) => setCustomEta(e.target.value)}
                placeholder="Enter minutes"
                min="1"
                max="120"
                style={styles.customInput}
              />
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Accepting...' : '✓ Accept & Start'}
            </button>
          </div>
        </form>
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
  backBtn: {
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '20px'
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
  details: {
    backgroundColor: '#f0fdf4',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  label: {
    fontWeight: '600',
    color: '#333'
  },
  etaOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  etaBtn: {
    padding: '12px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  customEta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  customInput: {
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    width: '80px'
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '6px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};