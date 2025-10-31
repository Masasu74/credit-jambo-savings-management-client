# Docker Setup for Credit Jambo Mobile Client App

## Overview

This Docker setup allows you to run the React Native/Expo mobile app in a containerized environment for development purposes.

**Note:** For production mobile apps, you typically build native iOS/Android apps directly, not through Docker. This Docker setup is primarily for development and testing.

## Prerequisites

- Docker and Docker Compose installed
- Backend API running (see admin repo Docker setup)

## Quick Start

### 1. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your backend API URL:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

**For Docker networking, if backend is also in Docker:**
```env
EXPO_PUBLIC_API_BASE_URL=http://host.docker.internal:4000/api
```

### 2. Build and Run

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f mobile-app

# Stop the container
docker-compose down
```

### 3. Access the App

Once running, you can:

- **Expo DevTools**: Open `http://localhost:8081` in your browser
- **Scan QR Code**: Use the QR code displayed in logs with Expo Go app
- **Metro Bundler**: Available on port 19000-19001

## Development Workflow

### Using Docker Compose

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Restart service
docker-compose restart mobile-app

# Stop services
docker-compose down

# Rebuild after dependency changes
docker-compose up --build
```

### Running Commands Inside Container

```bash
# Execute commands in running container
docker-compose exec mobile-app npm install
docker-compose exec mobile-app npx expo start --tunnel
```

## Configuration

### Environment Variables

Edit `docker-compose.yml` or use `.env` file:

```yaml
environment:
  EXPO_PUBLIC_API_BASE_URL: ${EXPO_PUBLIC_API_BASE_URL:-http://localhost:4000/api}
  NODE_ENV: ${NODE_ENV:-development}
```

### Ports

- `8081`: Expo DevTools
- `19000`: Metro bundler
- `19001`: Metro bundler alternative port
- `19002`: Expo Web

## Troubleshooting

### Issue: Cannot connect to backend API

**Solution**: If backend is running on host machine:
```env
EXPO_PUBLIC_API_BASE_URL=http://host.docker.internal:4000/api
```

If backend is in another Docker container, use service name:
```env
EXPO_PUBLIC_API_BASE_URL=http://backend:4000/api
```

### Issue: QR code not working

**Solution**: Use tunnel mode:
```bash
docker-compose exec mobile-app npx expo start --tunnel
```

### Issue: Metro bundler not starting

**Solution**: Check ports are available:
```bash
# Stop any existing Expo/Metro processes
docker-compose down

# Start fresh
docker-compose up --build
```

### Issue: Cannot see container logs

**Solution**: Use:
```bash
docker-compose logs -f mobile-app
```

## Limitations

1. **Physical Device Testing**: For best results, run Expo CLI directly on your host machine for physical device testing
2. **iOS Simulator**: Not available in Docker (Mac only, run on host)
3. **Android Emulator**: Requires host machine setup

## Recommended Development Setup

For actual mobile development:

1. **Development**: Run Expo CLI directly on host machine
   ```bash
   npm install
   npm start
   ```

2. **Testing**: Use Docker for isolated environment testing
   ```bash
   docker-compose up
   ```

3. **Production Build**: Use EAS Build or run builds on host machine
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

## Integration with Backend Docker

If both admin and client apps are containerized:

```bash
# Start both services (from admin repo root)
cd ../credit-jambo-savings-management-admin
docker-compose up -d

# Start client app
cd ../credit-jambo-savings-management-client
docker-compose up -d
```

Update client `.env`:
```env
EXPO_PUBLIC_API_BASE_URL=http://backend:4000/api
```

**Note**: Both docker-compose files should be on the same Docker network or use host networking.

## Production Notes

For production mobile apps:

1. **Build Native Apps**: Use EAS Build or build locally
2. **API Configuration**: Set production API URL in build
3. **No Docker Needed**: Mobile apps are distributed as .ipa (iOS) or .apk/.aab (Android)

---

## Support

For Docker setup issues:
- Check Docker logs: `docker-compose logs -f`
- Verify network connectivity
- Ensure ports are not in use

For mobile app development:
- See main README.md for detailed setup
- Use Expo documentation for native features

