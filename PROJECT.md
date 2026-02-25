# Node.js React.js Web Landing Health Check

## Overview
A modern web application featuring a responsive landing page with integrated health check monitoring capabilities. Built with Node.js backend and React.js frontend, this project provides both marketing presentation and service monitoring in one cohesive platform.

## Technology Stack

### Frontend
- **React.js** - Component-based UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast development build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **Axios** - HTTP client for API calls

### Health Check Features
- Service endpoint monitoring
- Real-time status updates
- Historical uptime tracking
- Alert notifications
- Health dashboard

## Project Structure
```
health-check-app/
├── frontend/           # React.js application
├── backend/            # Node.js API server
├── shared/             # Shared types and utilities
├── docs/               # Documentation
└── scripts/            # Build and deployment scripts
```

## Key Features

### Landing Page
- Hero section with call-to-action
- Features overview
- Pricing information
- Contact form
- Responsive design

### Health Check Dashboard
- Real-time service status
- Uptime statistics
- Response time monitoring
- Service dependency mapping
- Alert configuration

### API Endpoints
- `/api/health` - Health check status
- `/api/services` - Service configuration
- `/api/history` - Historical data
- WebSocket for real-time updates

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd health-check-app

# Install dependencies
npm install

# Start development servers
npm run dev
```

## Configuration

### Environment Variables
Create `.env` files for frontend and backend:

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

**Backend (`backend/.env`):**
```
PORT=3001
NODE_ENV=development
DATABASE_URL=sqlite:./data/health.db
```

## Health Check Configuration

Define services to monitor in `backend/config/services.json`:

```json
{
  "services": [
    {
      "id": "api-service",
      "name": "API Service",
      "url": "https://api.example.com",
      "interval": 60000,
      "timeout": 5000
    }
  ]
}
```

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

### Docker Deployment
```dockerfile
# Multi-stage Dockerfile
FROM node:18-alpine AS builder
# ... build steps ...

FROM node:18-alpine AS runner
# ... runtime steps ...
```

## Monitoring & Alerts

### Alert Channels
- Email notifications
- Slack integration
- Webhook support
- Dashboard alerts

### Metrics Collection
- Response times
- Uptime percentages
- Error rates
- Historical trends

## API Documentation

### Health Check Endpoints
- `GET /api/health` - Overall system health
- `GET /api/health/services` - Individual service status
- `POST /api/health/check` - Manual health check

### Service Management
- `GET /api/services` - List configured services
- `POST /api/services` - Add new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Remove service

## Testing

### Unit Tests
```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd ../backend
npm test
```

### Integration Tests
- Health check functionality
- API endpoint validation
- Real-time updates
- Error handling

## Security Considerations

- Input validation and sanitization
- Rate limiting on health check endpoints
- Secure WebSocket connections
- Environment variable management
- CORS configuration

## Maintenance

### Scheduled Tasks
- Daily health reports
- Weekly performance summaries
- Monthly maintenance checks

### Backup Strategy
- Database backups
- Configuration backups
- Log retention policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Join our community Discord server