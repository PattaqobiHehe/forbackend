// server.js - Expanded Version

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const complaintsRouter = require('./routes/complaints');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const departmentsRouter = require('./routes/departments');

app.use('/api/complaints', complaintsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);

// File Upload Configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(`complaints/${fileName}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });

    res.json({ url, fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// server.js - Expanded Version

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const complaintsRouter = require('./routes/complaints');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const departmentsRouter = require('./routes/departments');

app.use('/api/complaints', complaintsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);

// File Upload Configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(`complaints/${fileName}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });

    res.json({ url, fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});