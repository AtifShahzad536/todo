const express = require('express');
const { postAddItem, getItems, deleteItem,deleteAllItems,getOneItems } = require('../controllers/home');
const homeRouter = express.Router();
homeRouter.post('/addItem',postAddItem);
homeRouter.get('/getItems', getItems);
homeRouter.get('/getOneItem/:id', getOneItems);
homeRouter.delete('/deleteItem/:id', deleteItem);
homeRouter.delete('/allDelete',deleteAllItems)
homeRouter.put('/updateItem/:id', postAddItem); // Assuming you want to use the same route for updating
homeRouter.get('/', (req, res) => {
  res.status(200).send('Welcome to the Home API');
});

module.exports = homeRouter;
