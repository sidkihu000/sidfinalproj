# Advanced Setup & API Integration Guide

## Backend Integration

### Step 1: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your backend configuration:

```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_BOT_TOKEN=your_bot_token
VITE_OWNER_ID=your_owner_id
VITE_WS_URL=wss://your-api.com/ws
```

### Step 2: Create API Service Layer

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};

export const botAPI = {
  // Stats
  getStats: () => apiClient.get('/stats'),
  
  // Files
  listFiles: () => apiClient.get('/files'),
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    }).then(r => r.json());
  },
  
  // Bot Control
  startBot: (fileId) => apiClient.post(`/files/${fileId}/start`, {}),
  stopBot: (fileId) => apiClient.post(`/files/${fileId}/stop`, {}),
  restartBot: (fileId) => apiClient.post(`/files/${fileId}/restart`, {}),
  deleteFile: (fileId) => apiClient.delete(`/files/${fileId}`),
  
  // Admin
  listAdmins: () => apiClient.get('/admins'),
  addAdmin: (userId) => apiClient.post('/admins', { userId }),
  removeAdmin: (adminId) => apiClient.delete(`/admins/${adminId}`),
  
  // Subscriptions
  listSubscriptions: () => apiClient.get('/subscriptions'),
  addSubscription: (userId, days) => apiClient.post('/subscriptions', { userId, days }),
  removeSubscription: (userId) => apiClient.delete(`/subscriptions/${userId}`),
  
  // Broadcasting
  broadcast: (message) => apiClient.post('/broadcast', { message }),
  
  // Bot Control
  lockBot: () => apiClient.post('/bot/lock', {}),
  unlockBot: () => apiClient.post('/bot/unlock', {}),
  runAllScripts: () => apiClient.post('/bot/run-all', {})
};
```

### Step 3: Update Component to Use API

Replace mock data calls in `bot-hosting-platform.jsx`:

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const statsData = await botAPI.getStats();
      setStats(statsData);
      
      const filesData = await botAPI.listFiles();
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('Failed to load data', 'error');
    }
  };

  fetchData();
  
  // Refresh every 30 seconds
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);
}, []);
```

### Step 4: Implement Authentication

Create `src/hooks/useAuth.js`:

```javascript
import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  };
};
```

### Step 5: WebSocket for Real-time Updates

Create `src/services/websocket.js`:

```javascript
export class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = {};
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          if (this.listeners[type]) {
            this.listeners[type].forEach(callback => callback(payload));
          }
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.reconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  off(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  reconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, 3000);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

## Backend Flask/Express Example

### Flask Backend Example

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import psutil

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)

@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    return jsonify({
        'totalUsers': 156,
        'activeFiles': 48,
        'runningBots': 23,
        'totalUptime': '99.8%',
        'cpuUsage': psutil.cpu_percent(),
        'memoryUsage': psutil.virtual_memory().percent
    })

@app.route('/api/files', methods=['GET'])
@jwt_required()
def get_files():
    # Your logic here
    return jsonify([...])

@app.route('/api/files/upload', methods=['POST'])
@jwt_required()
def upload_file():
    file = request.files['file']
    # Malware scanning logic
    # Save file
    return jsonify({'status': 'success', 'file_id': '...'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # Verify credentials
    access_token = create_access_token(identity=user_id)
    return jsonify({'token': access_token, 'user': {...}})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
```

### Express Backend Example

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
const secret = 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/stats', authenticateToken, (req, res) => {
  res.json({
    totalUsers: 156,
    activeFiles: 48,
    runningBots: 23,
    totalUptime: '99.8%',
    cpuUsage: 45,
    memoryUsage: 62
  });
});

app.get('/api/files', authenticateToken, (req, res) => {
  // Your logic
  res.json([...]);
});

app.post('/api/files/upload', authenticateToken, upload.single('file'), (req, res) => {
  // Malware scan and save
  res.json({ status: 'success', file_id: '...' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Verify credentials
  const token = jwt.sign({ userId: user.id }, secret);
  res.json({ token, user: {...} });
});

app.listen(8000, () => console.log('Server running on port 8000'));
```

## Deployment

### Docker Compose with Backend

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://backend:8000/api
    depends_on:
      - backend

  backend:
    image: python:3.11
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    command: python app.py
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/bothost

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: bothost
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Testing

Create `__tests__/BotHostingPlatform.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react';
import BotHostingPlatform from '../bot-hosting-platform';

describe('BotHostingPlatform', () => {
  it('renders dashboard', () => {
    render(<BotHostingPlatform />);
    expect(screen.getByText('Bot Hosting Dashboard')).toBeInTheDocument();
  });

  it('displays stats cards', () => {
    render(<BotHostingPlatform />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Files')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting

```javascript
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const FilesPage = lazy(() => import('./pages/Files'));
const AdminPage = lazy(() => import('./pages/Admin'));
```

### Image Optimization

Use WebP with fallbacks:

```javascript
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.png" alt="description" />
</picture>
```

### Memoization

```javascript
const MemoizedCard = React.memo(StatCard);
```

---

For more help, refer to the main README.md and individual component comments.
