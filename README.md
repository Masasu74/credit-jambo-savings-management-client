# Credit Jambo Savings Management - Client Mobile Application

A React Native mobile application built with Expo for Credit Jambo savings management system. Customers can register, log in, manage savings accounts, and perform transactions securely.

## 🎯 Features

### Core Features
- ✅ **Customer Registration** - Sign up with personal information
- ✅ **Secure Login** - JWT-based authentication with device verification
- ✅ **Device Verification** - Automatic device registration (requires admin approval)
- ✅ **Savings Account Management** - View all savings accounts
- ✅ **Deposit & Withdraw** - Perform transactions on verified accounts
- ✅ **Transaction History** - View complete transaction history
- ✅ **Account Balance** - Real-time balance display
- ✅ **Low Balance Alerts** - Notifications for low account balances (backend)

### Security Features
- Device ID tracking for security
- Secure token storage using Expo Secure Store
- JWT authentication
- Device verification workflow

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Physical device with Expo Go app (optional, for testing)

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the `.env` file with your backend API URL:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

**For Production:**
```env
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

**Note:** For Expo apps, you can also configure the API URL in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:4000/api"
    }
  }
}
```

### 3. Start the Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser. You can then:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your physical device

## 📱 Running on Physical Device

### iOS (iPhone/iPad)

1. Install **Expo Go** from the App Store
2. Run `npm start`
3. Scan the QR code with your camera (iOS 13+)
4. Open in Expo Go when prompted

### Android

1. Install **Expo Go** from Google Play Store
2. Run `npm start`
3. Scan the QR code with Expo Go app

### Development Builds

For a production-like experience:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🏗️ Project Structure

```
credit-jambo-savings-management-client/
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   │   ├── sign-in.tsx    # Login screen
│   │   ├── sign-up.tsx    # Registration screen
│   │   └── not-verified.tsx # Device not verified screen
│   └── (tabs)/            # Main app screens
│       ├── index.tsx      # Home/Dashboard
│       ├── accounts.tsx   # Savings accounts list
│       ├── transactions.tsx # Transaction history
│       ├── add-savings.tsx # Create new account
│       └── profile.tsx    # User profile
├── src/
│   └── services/          # API services
│       ├── api.ts         # Base API configuration
│       ├── auth.ts        # Authentication services
│       └── savings.ts     # Savings account services
├── assets/                # Images, fonts, etc.
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── constants/             # Constants and configuration
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── .env.example          # Environment variables template
```

## 🔐 Authentication Flow

### Registration

1. User fills registration form (full name, email, password, phone)
2. Device ID is automatically generated and sent with registration
3. Backend creates customer account and registers device (pending verification)
4. User must wait for admin to verify device before login

### Login

1. User enters email and password
2. App sends device ID with login request
3. Backend verifies:
   - Credentials (email/password)
   - Device is verified by admin
4. If device not verified, user sees "Device not verified" screen
5. On success, JWT token is stored securely

### Device Verification

- **Automatic Registration**: Device ID is generated and registered during sign-up
- **Admin Approval**: Admin must verify device via admin panel
- **Verification Required**: Only verified devices can log in

## 📡 API Integration

### Base URL Configuration

The app automatically resolves the API base URL:

1. Checks `EXPO_PUBLIC_API_BASE_URL` environment variable
2. Checks `app.json` extra configuration
3. Derives from Expo dev server (for local development)
4. Falls back to `http://localhost:4000/api`

### API Endpoints Used

- `POST /api/customer-auth/register` - Customer registration
- `POST /api/customer-auth/login` - Customer login
- `GET /api/customer-auth/me` - Get current customer
- `GET /api/customer/savings-accounts/mine` - Get my accounts
- `POST /api/customer/savings-accounts` - Create account
- `POST /api/customer/transactions/deposit` - Deposit
- `POST /api/customer/transactions/withdrawal` - Withdraw
- `GET /api/customer/transactions` - Get transactions
- `GET /api/account-products/active` - Get account products

## 🧪 Development

### Linting

```bash
npm run lint
```

### Testing

The app uses Expo Router for navigation. Test on:

- iOS Simulator (Mac only)
- Android Emulator
- Physical device with Expo Go
- Web browser

### Debugging

- **React Native Debugger**: Enable via Expo Dev Tools
- **Console Logs**: Visible in Expo Dev Tools
- **Network Requests**: Use React Native Debugger or Chrome DevTools

## 🔧 Configuration

### API Base URL

**Method 1: Environment Variable (.env)**

```env
EXPO_PUBLIC_API_BASE_URL=http://your-api-url.com/api
```

**Method 2: app.json**

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://your-api-url.com/api"
    }
  }
}
```

### Device Configuration

Device ID is automatically generated and stored in AsyncStorage. The ID format is:
```
{deviceInfo}-{uuid}
```

## 📦 Building for Production

### iOS Build

```bash
eas build --platform ios
```

### Android Build

```bash
eas build --platform android
```

**Note:** Requires Expo Application Services (EAS) account setup.

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Failed
- **Solution**: Verify `EXPO_PUBLIC_API_BASE_URL` is set correctly
- Check backend is running on the specified URL
- For physical device, use your computer's LAN IP instead of `localhost`

#### 2. Device Not Verified Error
- **Cause**: Device ID hasn't been verified by admin
- **Solution**: Admin must verify device in admin panel before login

#### 3. Network Request Failed (Physical Device)
- **Solution**: Use your computer's IP address instead of `localhost`:
  ```env
  EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:4000/api
  ```

#### 4. Token Storage Issues
- **Solution**: Ensure `expo-secure-store` is properly installed
- Clear app data and reinstall if issues persist

## 🔒 Security Notes

- JWT tokens are stored securely using Expo Secure Store
- Device IDs are required for all authenticated requests
- All API requests include device verification
- Sensitive data is never logged

## 🐳 Docker Setup (Optional)

For development and testing, you can run the mobile app in Docker:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Note**: For actual mobile development, it's recommended to run Expo CLI directly on your host machine for better device support. See `DOCKER_SETUP.md` for details.

## 📚 Related Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [Credit Jambo Admin API Documentation](../credit-jambo-savings-management-admin/backend/API_DOCUMENTATION.md)
- [Docker Setup Guide](DOCKER_SETUP.md)

## 🆘 Support

For issues or questions:

- Email: hello@creditjambo.com
- Phone: +250 788 268 451
- Website: www.creditjambo.com

## 📄 License

This project is proprietary software owned by Credit Jambo Ltd.

---

## 🎯 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set `EXPO_PUBLIC_API_BASE_URL` in `.env`
- [ ] Start backend server (see admin repo README)
- [ ] Run `npm start`
- [ ] Open in simulator or scan QR code with Expo Go
- [ ] Register a new account
- [ ] Wait for admin to verify device
- [ ] Login and start using the app

**Note:** Ensure the backend server is running before using the app!
