const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/gallery', express.static(path.join(__dirname, '../public/gallery')));

// Initialize SQLite Database
const db = new Database('applications.db');

// Create applications table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    year TEXT NOT NULL,
    branch TEXT NOT NULL,
    section TEXT NOT NULL,
    role TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Create gallery table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    filename TEXT NOT NULL
  )
`);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/gallery');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Email Configuration (will work once you add .env file)
let transporter = null;

// Initialize email transporter if credentials exist
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✅ Email service configured');
} else {
  console.log('⚠️  Email not configured. Add EMAIL_USER and EMAIL_PASS to .env file');
}

// Helper function to generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ==================== APPLICATION ENDPOINTS ====================

// Submit Application Endpoint
app.post('/api/submit-application', async (req, res) => {
  try {
    const application = {
      id: generateId(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to SQLite database
    const insert = db.prepare(`
      INSERT INTO applications (id, fullName, email, year, branch, section, role, reason, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insert.run(
      application.id,
      application.fullName,
      application.email,
      application.year,
      application.branch,
      application.section,
      application.role,
      application.reason,
      application.status,
      application.createdAt,
      application.updatedAt
    );
    
    // Send emails only if transporter is configured
    if (transporter && process.env.ADMIN_EMAIL) {
      try {
        // Get total count for email
        const countStmt = db.prepare('SELECT COUNT(*) as count FROM applications');
        const totalCount = countStmt.get().count;
        
        // Send email to admin
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `🎬 New Film Club Application - ${application.fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e6b800;">🎬 New Film Club Application!</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                <p><strong>Application ID:</strong> ${application.id}</p>
                <p><strong>Name:</strong> ${application.fullName}</p>
                <p><strong>Email:</strong> ${application.email}</p>
                <p><strong>Year:</strong> ${application.year}</p>
                <p><strong>Branch:</strong> ${application.branch}</p>
                <p><strong>Section:</strong> ${application.section}</p>
                <p><strong>Role:</strong> ${application.role}</p>
                <p><strong>Why Join:</strong> ${application.reason}</p>
              </div>
              <p>📊 Total Applications: ${totalCount}</p>
            </div>
          `
        });

        // Send confirmation email to applicant
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.email,
          subject: '🎬 Application Received - NRCM Film Making Club',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
              <h1 style="color: #e6b800;">🎬 Welcome to NRCM Film Club!</h1>
              <p>Dear ${application.fullName},</p>
              <p>Thank you for applying to join NRCM Film Making Club. We've received your application and will review it shortly.</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <p><strong>📝 Application ID:</strong> ${application.id}</p>
                <p><strong>🎭 Role:</strong> ${application.role}</p>
                <p><strong>📊 Status:</strong> Pending Review</p>
              </div>
              <p>Keep creating! ✨</p>
              <p>- NRCM Film Making Club Team</p>
            </div>
          `
        });
        
        console.log(`📧 Emails sent for application ${application.id}`);
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log(`📝 Application saved (ID: ${application.id}) - No email sent (configuration missing)`);
    }

    res.status(201).json({ 
      success: true, 
      message: transporter ? 'Application submitted successfully! Check your email for confirmation.' : 'Application submitted successfully!',
      applicationId: application.id
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application. Please try again.' 
    });
  }
});

// Get all applications (Admin endpoint)
app.get('/api/applications', async (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM applications ORDER BY createdAt DESC');
    const applications = stmt.all();
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// Get single application by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM applications WHERE id = ?');
    const application = stmt.get(req.params.id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch application' });
  }
});

// Update application status (Admin endpoint)
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    // Get application first
    const getStmt = db.prepare('SELECT * FROM applications WHERE id = ?');
    const application = getStmt.get(id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    // Update status
    const updateStmt = db.prepare('UPDATE applications SET status = ?, updatedAt = ? WHERE id = ?');
    updateStmt.run(status, new Date().toISOString(), id);
    
    // Send status update email if transporter exists
    if (transporter && status !== 'pending') {
      const statusMessages = {
        approved: {
          subject: '🎉 Congratulations! Application Approved!',
          message: 'We are excited to welcome you to the team!'
        },
        rejected: {
          subject: 'Update on Your Application',
          message: 'Thank you for your interest. Unfortunately, we cannot proceed at this time.'
        }
      };
      
      if (statusMessages[status]) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.email,
          subject: statusMessages[status].subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e6b800;">NRCM Film Making Club</h2>
              <p>Dear ${application.fullName},</p>
              <p>${statusMessages[status].message}</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Application Status:</strong> ${status.toUpperCase()}</p>
                <p><strong>Application ID:</strong> ${application.id}</p>
              </div>
              <p>Best regards,<br/>NRCM Film Club Team</p>
            </div>
          `
        });
      }
    }
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Delete application (Admin endpoint)
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM applications WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete application' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM applications');
    const pendingStmt = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'");
    const approvedStmt = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'approved'");
    const rejectedStmt = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'rejected'");
    
    const stats = {
      total: totalStmt.get().count,
      pending: pendingStmt.get().count,
      approved: approvedStmt.get().count,
      rejected: rejectedStmt.get().count,
      byRole: {},
      byYear: {}
    };
    
    // Get role distribution
    const roleStmt = db.prepare('SELECT role, COUNT(*) as count FROM applications GROUP BY role');
    const roles = roleStmt.all();
    roles.forEach(row => {
      stats.byRole[row.role] = row.count;
    });
    
    // Get year distribution
    const yearStmt = db.prepare('SELECT year, COUNT(*) as count FROM applications GROUP BY year');
    const years = yearStmt.all();
    years.forEach(row => {
      stats.byYear[row.year] = row.count;
    });
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ==================== GALLERY ENDPOINTS ====================

// Upload image endpoint (Admin only)
app.post('/api/gallery/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const imageId = generateId();
    const imageUrl = `/gallery/${file.filename}`;
    
    const insert = db.prepare(`
      INSERT INTO gallery (id, url, title, category, date, filename)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insert.run(
      imageId,
      imageUrl,
      title,
      category,
      new Date().toISOString(),
      file.filename
    );
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        id: imageId,
        url: imageUrl,
        title: title,
        category: category,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM gallery ORDER BY date DESC');
    const images = stmt.all();
    res.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery' });
  }
});

// Delete gallery image
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get image info first
    const getStmt = db.prepare('SELECT filename FROM gallery WHERE id = ?');
    const image = getStmt.get(id);
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Delete file from filesystem
    const filePath = path.join(__dirname, '../public/gallery', image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    const deleteStmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    deleteStmt.run(id);
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`✅ SQLite database initialized`);
  console.log(`📁 Database file: ${process.cwd()}\\applications.db`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`\n📝 Application Endpoints:`);
  console.log(`   POST   http://localhost:${PORT}/api/submit-application`);
  console.log(`   GET    http://localhost:${PORT}/api/applications`);
  console.log(`   GET    http://localhost:${PORT}/api/applications/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/applications/:id/status`);
  console.log(`   DELETE http://localhost:${PORT}/api/applications/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/stats`);
  console.log(`\n📸 Gallery Endpoints:`);
  console.log(`   POST   http://localhost:${PORT}/api/gallery/upload`);
  console.log(`   GET    http://localhost:${PORT}/api/gallery`);
  console.log(`   DELETE http://localhost:${PORT}/api/gallery/:id`);
  console.log(`\n💡 Tip: Open admin.html to manage applications`);
  console.log(`💡 Tip: Go to /admin/gallery to manage gallery\n`);
});