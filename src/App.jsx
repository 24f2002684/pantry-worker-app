import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { listenForMessages } from './firebase';
import Login from './screens/Login';
import PendingRequests from './screens/PendingRequests';
import AcceptRequest from './screens/AcceptRequest';
import ActiveRequest from './screens/ActiveRequest';

// Protected Route Component
function ProtectedRoute({ children }) {
  const worker = localStorage.getItem('worker');
  
  if (!worker) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  useEffect(() => {
    // Listen for Firebase messages
    try {
      listenForMessages((payload) => {
        console.log('Notification received:', payload);
        // Show notification or update UI
        if (Notification.permission === 'granted') {
          new Notification(
            payload.notification?.title || 'New Request',
            {
              body: payload.notification?.body || 'You have a new request',
              icon: '/notification-icon.png'
            }
          );
        }
      });
    } catch (error) {
      console.log('Firebase messaging not available:', error);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <PendingRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accept"
          element={
            <ProtectedRoute>
              <AcceptRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/active"
          element={
            <ProtectedRoute>
              <ActiveRequest />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;