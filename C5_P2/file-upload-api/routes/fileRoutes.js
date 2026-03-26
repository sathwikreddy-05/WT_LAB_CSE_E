const express = require('express');
const multer = require('multer'); // multer is a middleware for handling multipart/form-data, which is used for uploading files

const router = express.Router();
const File = require('../models/file'); // Import the File model

// use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}); // Limit file size to 5 MB and allow only specific file types like jpeg, png, gif

// Route to handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      size: req.file.size
    });
    await file.save();
    res.status(201).json({ message: 'File uploaded successfully', fileId: file._id });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Route to get all files
router.get('/allfiles', async (req, res) => {
  try {
    const files = await File.find().select('-data'); // Exclude the file data from the response
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }
    res.status(200).json(files);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

// Route to handle file retrieval by ID
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.originalname}"`);
    res.send(file.data);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// Get metadata of a file
router.get('/metadata/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).select('-data'); // Exclude the file data from the response
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(file);
  } catch (error) {
    console.error('Error retrieving file metadata:', error);
    res.status(500).json({ message: 'Error retrieving file metadata' });
  }
});

module.exports = router;
