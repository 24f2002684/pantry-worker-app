import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingRequests } from '../services/api';

export default function PendingRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const worker = JSON.parse(localStorage.getItem('worker') || '{}');

  const fetchRequests = async () => {
    try {
      setError('');
      const data = await getPendingRequests(worker.name);
      setRequests(Array.isArray(data) ? data : []);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to load requests');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    setLoading(false);

    // Poll every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (request) => {
    localStorage.setItem('selectedRequest', JSON.stringify(request));
    navigate('/accept');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Pending Requests</h1>
        <div style={styles.headerRight}>
          <p style={styles.workerInfo}>Worker: {worker.name}</p>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.refreshInfo}>
        <button onClick={fetchRequests} style={styles.refreshBtn}>
          🔄 Refresh Now
        </button>
        <p style={styles.updateTime}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {requests.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No pending requests</p>
          <p style={styles.emptySubtext}>
            Refresh to check for new requests
          </p>
        </div>
      ) : (
        <div style={styles.requestsList}>
          {requests.map((request) => (
            <div
              key={request.ID}
              style={{
                ...styles.requestCard,
                borderLeftColor: getPriorityColor(request.Priority)
              }}
            >
              <div style={styles.requestHeader}>
                <span style={styles.requestId}>{request.Title}</span>
                <span style={getPriorityBadge(request.Priority)}>
                  {request.Priority}
                </span>
              </div>

              <div style={styles.requestDetails}>
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
                  <strong>Needed by:</strong>{' '}
                  {new Date(request.NeededBy).toLocaleTimeString()}
                </p>
              </div>

              <button
                onClick={() => handleAccept(request)}
                style={styles.acceptBtn}
              >
                ✓ Accept Request
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <p style={styles.footerText}>
          {requests.length} pending request{requests.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return '#dc2626';
    case 'Medium':
      return '#f97316';
    case 'Low':
      return '#16a34a';
    default:
      return '#666';
  }
};

const getPriorityBadge = (priority) => {
  const baseStyles = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  };

  const colors = {
    High: '#dc2626',
    Medium: '#f97316',
    Low: '#16a34a'
  };

  return {
    ...baseStyles,
    backgroundColor: colors[priority] || '#666'
  };
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e5e7eb'
  },
  title: {
    margin: 0,
    color: '#16a34a',
    fontSize: '24px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  workerInfo: {
    margin: 0,
    color: '#666',
    fontSize: '14px'
  },
  logoutBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  refreshInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px'
  },
  refreshBtn: {
    padding: '6px 12px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  updateTime: {
    margin: 0,
    fontSize: '12px',
    color: '#666'
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 10px 0'
  },
  emptySubtext: {
    color: '#999',
    fontSize: '14px',
    margin: 0
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  requestId: {
    fontWeight: 'bold',
    color: '#333'
  },
  requestDetails: {
    marginBottom: '12px'
  },
  requestDetails: {
    marginBottom: '12px'
  },
  acceptBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  },
  footerText: {
    margin: 0
  }
};