const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");
const fs = require('fs');

const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    // Create unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mkv|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File type not supported! Only images, videos, and PDFs are allowed.'));
    }
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Cloudinary logic commented out
    /*
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
    */

    // Local file logic
    // Construct the URL where the file can be accessed
    // Assuming server is running on localhost:5000 and serving 'public/uploads' at '/uploads'
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        public_id: req.file.filename // Using filename as ID for local deletion
      },
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    // Cloudinary logic commented out
    /*
    await deleteMediaFromCloudinary(id);
    */

    // Local file deletion logic
    // id is the filename
    const filePath = `public/uploads/${id}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.log("File not found for deletion:", filePath);
      // Proceed even if not found to handle edge cases or if it was already deleted
    }

    res.status(200).json({
      success: true,
      message: "Assest deleted successfully from local storage",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    /*
  const uploadPromises = req.files.map((fileItem) =>
    uploadMediaToCloudinary(fileItem.path)
  );

  const results = await Promise.all(uploadPromises);
  */

    const results = req.files.map(file => ({
      url: `http://localhost:5000/uploads/${file.filename}`,
      public_id: file.filename
    }));

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);

    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
