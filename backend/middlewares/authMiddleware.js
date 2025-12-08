
// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../src/lib/prisma.js');
require('dotenv').config();

// Verify JWT token (alias for authenticate)
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Token format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If patientId is missing from token but role is patient, fetch it from database
    if (decoded.role === 'patient' && !decoded.patientId) {
      try {
        const portalUser = await prisma.portalUser.findUnique({
          where: { id: decoded.id },
          select: { patientId: true }
        });
        if (portalUser?.patientId) {
          decoded.patientId = portalUser.patientId;
          console.log(`✅ Fetched patientId ${portalUser.patientId} for user ${decoded.id}`);
        } else {
          console.warn(`⚠️ No patientId found for user ${decoded.id} with role patient`);
        }
      } catch (dbError) {
        console.error('Error fetching patientId from database:', dbError);
        // Continue without patientId - controller will handle it
      }
    }
    
    // Similar for other roles
    if (decoded.role === 'doctor' && !decoded.doctorId) {
      try {
        const portalUser = await prisma.portalUser.findUnique({
          where: { id: decoded.id },
          select: { doctorId: true }
        });
        if (portalUser?.doctorId) {
          decoded.doctorId = portalUser.doctorId;
        }
      } catch (dbError) {
        console.error('Error fetching doctorId from database:', dbError);
      }
    }
    
    // Fetch employeeId/staffId for staff users
    if ((decoded.role === 'staff' || decoded.role === 'admin') && !decoded.employeeId && !decoded.staffId) {
      try {
        const portalUser = await prisma.portalUser.findUnique({
          where: { id: decoded.id },
          select: { employeeId: true, staffId: true }
        });
        if (portalUser?.employeeId) {
          decoded.employeeId = portalUser.employeeId;
          console.log(`✅ Fetched employeeId ${portalUser.employeeId} for user ${decoded.id}`);
        }
        if (portalUser?.staffId) {
          decoded.staffId = portalUser.staffId;
          console.log(`✅ Fetched staffId ${portalUser.staffId} for user ${decoded.id}`);
        }
      } catch (dbError) {
        console.error('Error fetching employeeId/staffId from database:', dbError);
      }
    }
    
    req.user = decoded; // Store decoded user info in request
    req.admin = decoded; // Also store as admin for backward compatibility
    
    // Debug logging
    if (decoded.role === 'patient') {
      console.log(`🔐 Authenticated patient: userId=${decoded.id}, patientId=${decoded.patientId || 'NOT SET'}`);
    }
    
    next(); // Proceed to protected route
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Authorize based on user roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role || req.user.userRole;
    
    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Alias for backward compatibility
const protect = authenticate;

const authMiddleware = {
  // Verify JWT token (backward compatibility)
  verifyToken: authenticate,
  // New exports
  authenticate,
  authorize,
  protect,
};

module.exports = authMiddleware;
module.exports.authenticate = authenticate;
module.exports.authorize = authorize;
module.exports.protect = protect;
