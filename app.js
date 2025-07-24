const express=require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const homeRouter = require('./routes/home');
const rootDir = require('./utils/pathUtil');
const path = require('path');
const app=express();
require('dotenv').config();


const port = process.env.port || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/upload/',express.static(path.join(rootDir, 'upload'))); // Serve static files from 'upload' directory
const filefilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
    }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

app.use(multer({ storage,filefilter }).single('photo')); 
app.use(homeRouter);
const dbUrl=process.env.MONGODB_URI;
if (!dbUrl) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}
mongoose.connect(dbUrl)
.then(()=>{
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
})
.catch((err)=>{ 
    console.error("Error connecting to MongoDB:", err);
});
