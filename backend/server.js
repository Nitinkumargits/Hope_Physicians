// server.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");

// Import routes
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const patientFormRoutes = require("./routes/patientFormRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Staff dashboard routes
const receptionRoutes = require("./routes/staff/receptionRoutes");
const nurseRoutes = require("./routes/staff/nurseRoutes");
const labRoutes = require("./routes/staff/labRoutes");
const pharmacyRoutes = require("./routes/staff/pharmacyRoutes");
const staffRoutes = require("./routes/staff/staffRoutes");
const staffManagementRoutes = require("./routes/admin/staffManagementRoutes");
const kycRoutes = require("./routes/admin/kycRoutes");
const adminGeneralRoutes = require("./routes/admin/adminRoutes");

// Patient dashboard routes
const patientAppointmentRoutes = require("./routes/patient/appointmentRoutes");
const patientPrescriptionRoutes = require("./routes/patient/prescriptionRoutes");
const patientReportRoutes = require("./routes/patient/reportRoutes");
const patientBillingRoutes = require("./routes/patient/billingRoutes");
const patientPaymentRoutes = require("./routes/patient/paymentRoutes");
const patientInsuranceRoutes = require("./routes/patient/insuranceRoutes");
const patientReminderRoutes = require("./routes/patient/reminderRoutes");
const patientChatRoutes = require("./routes/patient/chatRoutes");
const patientAdmissionRoutes = require("./routes/patient/admissionRoutes");
const patientFeedbackRoutes = require("./routes/patient/feedbackRoutes");

const app = express();

// CORS Configuration - Environment-aware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variable
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://127.0.0.1:5173",
          "http://127.0.0.1:5174",
          "http://52.66.236.157",
          "http://52.66.236.157:80",
          "http://52.66.236.157:443",
          "https://52.66.236.157",
        ];

    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patient-forms", patientFormRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/notifications", notificationRoutes);

// Staff dashboard routes
app.use("/api/staff/reception", receptionRoutes);
app.use("/api/staff/nurse", nurseRoutes);
app.use("/api/staff/lab", labRoutes);
app.use("/api/staff/pharmacy", pharmacyRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admin/staff", staffManagementRoutes);
app.use("/api/admin/kyc", kycRoutes);
app.use("/api/admin", adminGeneralRoutes);

// Patient dashboard routes
app.use("/api/patient/appointments", patientAppointmentRoutes);
app.use("/api/patient/prescriptions", patientPrescriptionRoutes);
app.use("/api/patient/reports", patientReportRoutes);
app.use("/api/patient/billing", patientBillingRoutes);
app.use("/api/patient/payments", patientPaymentRoutes);
app.use("/api/patient/insurance", patientInsuranceRoutes);
app.use("/api/patient/reminders", patientReminderRoutes);
app.use("/api/patient/chat", patientChatRoutes);
app.use("/api/patient/admission", patientAdmissionRoutes);
app.use("/api/patient/feedback", patientFeedbackRoutes);

// Health check endpoint (for monitoring and load balancers)
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    const { prisma } = require("./src/lib/prisma.js");
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "HOPE PHYSICIAN API is running...",
    version: "1.0.0",
    health: "/health",
    docs: "/api",
  });
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Start server with proper error handling
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Listen on all interfaces for external access

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    console.log("🔌 Testing database connection...");
    const { prisma } = require("./src/lib/prisma.js");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(
        `📡 CORS enabled for origins: ${
          process.env.CORS_ORIGINS || "default (localhost + 52.66.236.157)"
        }`
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`💚 Health check: http://${HOST}:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        console.log("HTTP server closed");
        try {
          await prisma.$disconnect();
          console.log("Database connection closed");
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Start the server
startServer();
