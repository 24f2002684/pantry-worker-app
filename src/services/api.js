import axios from 'axios';

const FLOW_URLS = {
  LOGIN: 'https://defaultb85de5b83fd34b2093280d268db128.2f.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/809614a1784844708dd3ec0e85536dae/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=I0qdDK2gHJobufKO-cly1CoZBa_0miB0A-7ykEiPtV8',
  SAVE_TOKEN: 'https://defaultb85de5b83fd34b2093280d268db128.2f.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/dbc8ab98e0ad4ca6ad77c7026e0afdb9/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3nM9Io9Fdv7xEKXcjkoSLqv3vcm2kWS2EDJvDwMdRhI',
  FETCH_REQUESTS: 'https://defaultb85de5b83fd34b2093280d268db128.2f.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/508dbcb152474593a16e8dc6acd3d1cc/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4kzKMKfNwhr1GFcNMuRslmbK7n3t2GmwvYEKBud5sEI',
  ACCEPT_REQUEST: 'https://defaultb85de5b83fd34b2093280d268db128.2f.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/2faedf873c5d4a8c9a72dbdf825e521c/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VR0BYagY7jNoCRUot2vIPMO9rmXrjyCIasmvUCWBQvk',
  MARK_DELIVERED: 'https://defaultb85de5b83fd34b2093280d268db128.2f.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/d8c1a36ac7134b3ba3f3829d33921609/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QGeFnK1kOxlmIge9TSBo7uYENL0eLUS2FK7M_y1tu0s',
  SUBMIT_DELAY: 'https://defaultb85de5b83fd34b2093280d268db128.2f.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/45d5a5c5aac74e8b9ece0afe44248a2a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TW9SWShrRkmHMEtRWpQv_Zd--_VitBWZdd4plhrkWVM'
};

// Axios instance with CORS handling
const api = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const loginWorker = async (workerName, pin) => {
  try {
    const response = await api.post(FLOW_URLS.LOGIN, {
      workerName,
      pin
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const saveFCMToken = async (workerName, fcmToken) => {
  try {
    const response = await api.post(FLOW_URLS.SAVE_TOKEN, {
      workerName,
      fcmToken
    });
    return response.data;
  } catch (error) {
    console.error('Save token error:', error);
    throw error;
  }
};

export const getPendingRequests = async (workerName) => {
  try {
    const response = await api.post(FLOW_URLS.FETCH_REQUESTS, {
      workerName
    });
    // Response from Flow 4 returns array directly
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.value || [];
  } catch (error) {
    console.error('Fetch requests error:', error);
    throw error;
  }
};

export const acceptRequest = async (requestId, workerName, etaMinutes) => {
  try {
    const response = await api.post(FLOW_URLS.ACCEPT_REQUEST, {
      requestId: parseInt(requestId),
      workerName,
      etaMinutes: parseInt(etaMinutes)
    });
    return response.data;
  } catch (error) {
    console.error('Accept request error:', error);
    throw error;
  }
};

export const markDelivered = async (requestId, workerName) => {
  try {
    const response = await api.post(FLOW_URLS.MARK_DELIVERED, {
      requestId: parseInt(requestId),
      workerName
    });
    return response.data;
  } catch (error) {
    console.error('Mark delivered error:', error);
    throw error;
  }
};

export const submitDelayReason = async (requestId, reason) => {
  try {
    const response = await api.post(FLOW_URLS.SUBMIT_DELAY, {
      requestId: parseInt(requestId),
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Submit delay reason error:', error);
    throw error;
  }
};