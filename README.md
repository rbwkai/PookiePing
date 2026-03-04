# 🎀 PookiePing

A local-network shared wall application for educational cybersecurity purposes (XSS testing).

> ⚠️ **WARNING**: This application is intentionally vulnerable for educational purposes. **NEVER** deploy this publicly. Use only on isolated local networks for learning.

---

## 📁 Project Structure

```
XSS/
├── server/                    # Backend (Express + MongoDB)
│   ├── server.js              # Main entry point - starts Express, connects to MongoDB
│   ├── config.js              # Configuration - ports, secrets, SANITIZATION TOGGLE
│   ├── package.json           # Backend dependencies
│   ├── models/
│   │   ├── User.js            # User schema (username, hashed password)
│   │   └── Post.js            # Post schema (author, content, timestamp)
│   ├── routes/
│   │   ├── auth.js            # /api/auth/register, /api/auth/login
│   │   └── posts.js           # /api/posts (GET, POST)
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   └── utils/
│       └── sanitize.js        # HTML sanitization utility (DOMPurify alternative)
│
├── client/                    # Frontend (React)
│   ├── package.json           # Frontend dependencies
│   ├── public/
│   │   └── index.html         # HTML template
│   └── src/
│       ├── index.js           # React entry point
│       ├── App.js             # Main App component with routing
│       ├── App.css            # All styles (dark theme)
│       ├── context/
│       │   └── AuthContext.js # Authentication state management
│       └── components/
│           ├── Login.js       # Login page
│           ├── Register.js    # Registration page
│           └── Wall.js        # Main wall page (XSS vulnerable)
│
└── README.md                  # This file
```

---

## 🛠️ Prerequisites

### 1. Install Node.js
Download and install Node.js (v18 or later):
- https://nodejs.org/

Verify installation:
```powershell
node --version
npm --version
```

### 2. Install MongoDB Locally

**Option A: MongoDB Community Server (Recommended)**

1. Download MongoDB Community Server:
   - https://www.mongodb.com/try/download/community
   - Select "Windows" and "msi" package

2. Run the installer:
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (optional GUI)

3. Verify MongoDB is running:
```powershell
# Check service status
Get-Service MongoDB

# Or try connecting
mongosh
```

**Option B: Manual Start (if not running as service)**
```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB
mongod
```

---

## 🚀 Installation & Setup

### Step 1: Install Backend Dependencies

```powershell
cd server
npm install
```

### Step 2: Install Frontend Dependencies

```powershell
cd client
npm install
```

### Step 3: Build React for Production

```powershell
cd client
npm run build
```

This creates a `build/` folder with static files that Express will serve.

### Step 4: Start the Server

```powershell
cd server
npm start
```

You should see:
```
✅ Connected to MongoDB

===========================================
🚀 XSS TESTING PLAYGROUND SERVER RUNNING
===========================================
📍 Local:    http://localhost:6209
📍 Network:  http://<YOUR_LOCAL_IP>:6209
===========================================
🔒 Sanitization: DISABLED (Unsafe - XSS Active)
===========================================
```

---

## 🌐 Accessing from Other Devices (Same WiFi)

### Step 1: Find Your Local IP Address

Open PowerShell and run:
```powershell
ipconfig
```

Look for "IPv4 Address" under your WiFi adapter:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . : 192.168.1.105
```

### Step 2: Configure Windows Firewall

**Option A: Allow through Windows Firewall (Recommended)**

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter "6209" → Next
6. Select "Allow the connection" → Next
7. Check all profiles (Domain, Private, Public) → Next
8. Name: "XSS Playground" → Finish

**Option B: Quick PowerShell Command (Run as Admin)**
```powershell
New-NetFirewallRule -DisplayName "XSS Playground" -Direction Inbound -Protocol TCP -LocalPort 6209 -Action Allow
```

### Step 3: Access from Other Devices

On any device connected to the same WiFi:
```
http://192.168.1.105:6209
```
(Replace with your actual IP address)

---

## 🔧 Configuration

All configuration is in `server/config.js`:

```javascript
module.exports = {
  // ⚠️ XSS MODE TOGGLE
  ENABLE_SANITIZATION: false,  // false = XSS works, true = XSS blocked

  // Server
  PORT: 6209,
  HOST: 'localhost',  // Use '0.0.0.0' for LAN access

  // Database
  MONGODB_URI: 'mongodb://127.0.0.1:27017/xss-playground',

  // JWT
  JWT_SECRET: 'xss-playground-secret-key-change-me',
  JWT_EXPIRES_IN: '24h',
};
```

---

## ⚠️ XSS Playground Mode

### Toggle Sanitization

Edit `server/config.js`:

```javascript
// UNSAFE MODE (XSS works) - Default
ENABLE_SANITIZATION: false

// SAFE MODE (XSS blocked)
ENABLE_SANITIZATION: true
```

**Restart the server after changing!**

### How It Works

| Mode | Input | Storage | Rendering | XSS |
|------|-------|---------|-----------|-----|
| **Unsafe** (false) | Raw HTML | Raw HTML | dangerouslySetInnerHTML | ✅ Works |
| **Safe** (true) | Sanitized | Clean HTML | dangerouslySetInnerHTML | ❌ Blocked |

---

## 🧪 Testing XSS Vulnerabilities

### Prerequisites
1. Make sure `ENABLE_SANITIZATION: false` in config
2. Restart server
3. Register/login to the app

### XSS Test Payloads

**Test 1: Classic Hack Message (Most Reliable)**
```html
<img src="x" onerror="alert('I hacked You, and your mind..')">
```

**Test 2: SVG Version**
```html
<svg onload="alert('I hacked You, and your mind..')"></svg>
```

**Test 3: Script Tag**
```html
<script>alert('I hacked You, and your mind..')</script>
```
> ⚠️ Note: Modern browsers may block inline scripts. Use Test 1 or 2.

**Test 4: Hover Trigger**
```html
<div onmouseover="alert('I hacked You, and your mind..')">Hover over me!</div>
```

**Test 5: Click Trigger**
```html
<a href="javascript:alert('I hacked You, and your mind..')">Click me</a>
```

**Test 6: Cookie Stealer (Educational)**
```html
<img src="x" onerror="alert(document.cookie)">
```

**Test 7: DOM Manipulation**
```html
<img src="x" onerror="document.body.style.backgroundColor='red'">
```

**Test 8: Keylogger Demo**
```html
<img src="x" onerror="document.onkeypress=function(e){console.log(e.key)}">
```

### Testing Sanitization

1. Set `ENABLE_SANITIZATION: true`
2. Restart server
3. Try the same payloads
4. They should be stripped/neutralized

---

## 📋 API Reference

### Authentication

**Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Posts (Requires Authentication)

**Get All Posts**
```
GET /api/posts
Authorization: Bearer <token>
```

**Create Post**
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "<b>Hello</b> World!"
}
```

### Status Check
```
GET /api/status
```

---

## 🛡️ Security Notes

### Why Raw HTML Rendering is Dangerous

1. **Cross-Site Scripting (XSS)**: Attackers can inject malicious scripts
2. **Session Hijacking**: Scripts can steal cookies/tokens
3. **Keylogging**: Capture user keystrokes
4. **Phishing**: Modify page content to trick users
5. **Malware Distribution**: Redirect to malicious sites
6. **Data Theft**: Access sensitive information

### What Happens in Unsafe Mode

- HTML is stored exactly as submitted
- React renders HTML using `dangerouslySetInnerHTML`
- No sanitization = all scripts execute
- Any user can affect all other users

### What Sanitization Protects Against

The `sanitize-html` library removes:
- `<script>` tags
- Event handlers (`onclick`, `onerror`, etc.)
- `javascript:` URLs
- Other dangerous elements

### Why This Should NEVER Be Deployed Publicly

1. **Real users could be harmed** by malicious posts
2. **Legal liability** for hosting malicious content
3. **Reputation damage** to your organization
4. **Could be used as attack vector** against visitors

### Why Local Network is "Safe"

- Limited to devices you control
- No external access
- For educational purposes only
- Still, be careful what you post!

---

## 🔄 Development Workflow

### If you modify frontend code:

```powershell
cd "c:\Users\IUT_220041109\OneDrive\Desktop\XSS\client"
npm run build
```

Then refresh the browser.

### If you modify backend code:

Restart the server:
```powershell
# Stop with Ctrl+C, then:
cd "c:\Users\IUT_220041109\OneDrive\Desktop\XSS\server"
npm start
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB service
```powershell
# Start service
net start MongoDB

# Or manually
mongod --dbpath C:\data\db
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::6209
```

**Solution**: Change port in `config.js` or kill the process
```powershell
# Find process using port 6209
netstat -ano | findstr :6209

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Can't Access from Other Devices

1. Check firewall rules (see above)
2. Verify you're on the same WiFi network
3. Confirm IP address is correct
4. Try disabling Windows Firewall temporarily (for testing)

### React Build Errors

```powershell
# Clear cache and rebuild
cd client
rm -r node_modules
rm package-lock.json
npm install
npm run build
```

---

## 📝 Quick Reference

| Action | Command |
|--------|---------|
| Install backend | `cd server && npm install` |
| Install frontend | `cd client && npm install` |
| Build frontend | `cd client && npm run build` |
| Start server | `cd server && npm start` |
| Find local IP | `ipconfig` |
| Toggle XSS mode | Edit `server/config.js` → `ENABLE_SANITIZATION` |

---

## 📜 License

MIT License - For educational purposes only.

---

## ⚠️ Disclaimer

This software is provided for **educational purposes only**. The authors are not responsible for any misuse or damage caused by this software. Only use on isolated networks that you own or have permission to test.

**Never deploy this application on a public network or the internet.**

