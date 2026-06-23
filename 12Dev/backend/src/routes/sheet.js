const express = require('express');
const sheetRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { 
  getCompanySheet, 
  getCompanyProgress, 
  getAllSheetsProgress 
} = require('../controllers/sheetController');

sheetRouter.get('/progress', userMiddleware, getAllSheetsProgress);
sheetRouter.get('/:company', userMiddleware, getCompanySheet);
sheetRouter.get('/:company/progress', userMiddleware, getCompanyProgress);

module.exports = sheetRouter;
