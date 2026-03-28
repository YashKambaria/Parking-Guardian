# Parking Guardian

![Parking Guardian Banner](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-lightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-yellow)

## 📌 Problem It Solves

**Parking Guardian** addresses the common and frustrating problem of incorrectly or illegally parked vehicles blocking other cars, driveways, or reserved spots. Traditionally, finding the owner of an improperly parked vehicle is difficult, leading to public announcements, towing, and heated disputes. 

Parking Guardian acts as a mediator: it allows a user to report a parking violation purely by entering the offending vehicle's license plate number (and optionally its location). The system then securely routes an automated notification (via SMS, Calls, or Email) to the registered owner of the vehicle, instructing them to move it. This solves the problem quickly and privately, protecting the privacy of both parties and saving time.

## 🌟 Core Features
- **User Registration & Authentication**: Secure sign-up/login with JWT (JSON Web Tokens) and OTP validation.
- **Vehicle Vault**: Users can securely register their vehicles (make, model, license plate) to their profiles.
- **Automated Notifications**: Triggers instant alerts routed via **Twilio SMS, Calls, and Email Services** when an issue is reported (delivery speed depends on third-party service latency).
- **Geolocation Tracking**: Integrated geolocation tracking for capturing precise complaint locations, effectively addressing urban parking challenges.
- **High-Performance Async Processing**: Implemented multithreaded background processing using Spring `@Async`, drastically reducing blocking API response time from **5104 ms to 1 ms**.
- **Anonymous Reporting**: Report a blocking vehicle by just typing the license plate without revealing your identity.
- **Automated Reset Scheduler**: Background jobs to reset daily complaint limits to prevent notification spam.
- **History & Profile Tracking**: Trace past reports or manage multiple vehicles from a personalized dashboard.

## 🏗 Architecture & Tech Stack

The application uses a decoupled Client-Server architecture utilizing a modern technology stack.

### 🌐 Frontend (React + Vite)
- **Framework**: React.js bundled via Vite for extremely high performance.
- **Styling**: Tailwind CSS for modern, fully responsive user interfaces with built-in Dark Mode support.
- **State & Routing**: `React Router` handles protected page navigation, and React's `Context API` provides a robust global authentication state.

### ⚙️ Backend (Java Spring Boot)
- **Framework**: Designed robust RESTful APIs using Java Spring Boot.
- **Security**: Secured with Spring Security pipelines combined with custom JWT Authentication logic.
- **Multithreading**: Utilizes Spring `@Async` to automate and decouple heavy notification payloads (SMS/Call/Email), preventing server thread-blocking.
- **Services layer**: Business logic systematically decoupled into specialized services (`EmailService`, `OtpService`, `NotificationService`, Scheduler).

### 🗄 Database & Third-Party APIs
- **Database**: **MongoDB** (NoSQL). Chosen for its flexible document-centric schema, effectively managing user profiles, dynamic vehicles, and complaints natively.
- **Messaging**: Integrated with the **Twilio API** to deliver low-latency SMS to vehicle owners.
- **Mailing**: `JavaMailSender` handling SMTP routing over Gmail to serve fallback emails and OTP codes.

## 🛠 Setup Guide (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ recommended
- **npm**: comes with Node.js
- **Java**: JDK 8 (project currently targets Java 1.8)
- **Maven**: not required globally (project includes Maven Wrapper)
- **MongoDB**: local instance or MongoDB Atlas connection string

### 2. Clone the Project
```bash
git clone https://github.com/YashKambaria/Parking-Guardian
cd "Parking Guardian"
```

### 3. Backend Setup (Spring Boot)

Go to the backend folder:
```bash
cd journalApp
```

Set required environment variables (macOS/Linux):
```bash
export MONGO_URI="mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
export EMAIL="your-email@gmail.com"
export PASSWORD="your-email-app-password"
export SID="your-twilio-account-sid"
export ID="your-twilio-auth-token"
export NUMBER="+1XXXXXXXXXX"
export KEY="your-jwt-secret-key"
```

Environment variable reference:
- `MONGO_URI`: MongoDB connection URI
- `EMAIL`: sender email used by `JavaMailSender`
- `PASSWORD`: email app password (not normal mailbox password)
- `SID`: Twilio Account SID
- `ID`: Twilio Auth Token
- `NUMBER`: Twilio phone number used to send SMS/calls
- `KEY`: JWT signing key used for token generation/validation

Run backend:
```bash
./mvnw spring-boot:run
```

Backend default URL:
- `http://localhost:8080`

### 4. Frontend Setup (React + Vite)

Open a new terminal and go to frontend folder:
```bash
cd frontend
npm install
```

Frontend API base URL is centralized in:
- `src/config.js`

Current setup uses:
```js
export const BASE_URL = "http://localhost:8080";
```

If your backend runs on a different host/port, update only this one value in `src/config.js`.

Run frontend:
```bash
npm run dev
```

Frontend default URL:
- `http://localhost:5173`

### 5. Quick Run Checklist
1. Start MongoDB (or ensure Atlas URI is reachable).
2. Export backend environment variables.
3. Start backend from `journalApp`.
4. Start frontend from `frontend`.
5. Open `http://localhost:5173` in browser.

### 6. Notes on Configuration
- The backend secrets are read from environment variables in `journalApp/src/main/resources/application.yml`.
- The frontend does **not** require a `.env` file right now; API host is controlled via `src/config.js`.
- Never commit real credentials (Twilio token, email password, JWT key, Mongo URI) to Git.

## 🚀 How It Works
1. **Sign Up / Register Vehicle**: A user creates an account and ties their license plate to their contact info.
2. **User Gets Blocked**: Someone gets their driveway blocked by a car. They enter the license plate on the Parking Guardian portal.
3. **Instant Notification**: The registered owner gets an SMS and email alerting them instantly.
4. **Resolution**: The owner moves the car. Total privacy maintained.

## 🔮 Future Scalability
As the Parking Guardian system heads towards thousands of daily active users, it can be extended in numerous ways:

1. **AI License Plate Recognition (ALPR)**: Instead of manually typing plate numbers, users can snap a photo of the car. The frontend submits the image, and a Cloud Vision API extracts the license plate automatically.
2. **QR Code Windshield Decals**: Users can stick generated QR codes on their cars. Anyone blocked just scans the QR code to instantly fire off an alert to the backend.
3. **Multi-Tenant System (B2B)**: Can be sold as a B2B SaaS platform for Universities, private apartments, or office complexes to manage closed parking ecosystems.
4. **Data Analytics Dashboard**: Aggregating violation frequency, repeat offenders, and heatmap generation using the existing `AdminController`.

---


