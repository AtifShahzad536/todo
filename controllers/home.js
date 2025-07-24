const home = require("../models/home");
const fs = require('fs');
exports.postAddItem = (req, res, next) => {
  const updateitemID = req.params.id; // Get the ID from the request parameters if updating
  const { item, date, price } = req.body;
  const photo = req.file ? req.file.path : req.body.photo; // Use the uploaded file path or the existing photo path
  console.log('File uploaded:', photo);
  console.log('Request body:', req.body);
  if(updateitemID) {
    console.log("Updating item with ID:", updateitemID);
    home.findById(updateitemID)
      .then(existingItem => {
        if (!existingItem) {
          return res.status(404).json({ message: 'Item not found' });
        }
        existingItem.item = item || existingItem.item;
        existingItem.date = date || existingItem.date;
        existingItem.price = price || existingItem.price;
        if (req.file) {
          // If a new photo is uploaded, delete the old one
          if (existingItem.photo) {
            fs.unlink(existingItem.photo, (err) => {
              if (err) {
                console.error("Error deleting old photo:", err);
              }
            });
          }
          existingItem.photo = photo;
        }
        return existingItem.save();
      })
      .then(() => {
        console.log('Item updated successfully:', updateitemID);
        res.status(200).json({ message: 'Item updated successfully' });
      })
      .catch(err => {
        console.error('Error updating item:', err);
        res.status(500).send('Internal Server Error');
    });
  }
  else
  {

  const Home = new home({
    item: item ? item : "Default Item",
    date: date,
    photo: photo,
    price: price
  });
  Home.save()
    .then(() => {
      console.log('Item added successfully:', Home);
      res.status(201).json({ message: 'Item added successfully', item: Home });
    })
    .catch(err => {
      console.error('Error adding item:', err);
      res.status(500).send('Internal Server Error');
    });
  }
}
// exports.postAddItem = async (req, res) => {
//   try {
//     console.log("Received body:", req.body);   // name, date, quantity
//     console.log("Received file:", req.file);   // image file

//     const { item,price,date } = req.body;
//     const imagePath = req.file ? req.file.filename : null;

//     // Save item to DB here...
//     // await Item.create({ name, date, quantity, image: imagePath });

//     return res.status(200).json({ message: "Item added successfully" });
//   } catch (error) {
//     console.error("Error in postAddItem:", error);
//     return res.status(500).json({ error: "Failed to add item" });
//   }
// };

exports.getItems = (req, res, next) => {
  home.find()
    .then(items => {

      res.status(200).json({
        items: items
      });
      console.log('Items fetched successfully:', items);
    })
    .catch(err => {
      console.error('Error fetching items:', err);
      res.status(500).send('Internal Server Error');
    });
}
exports.getOneItems = (req, res, next) => {
  const id = req.params.id ; // Default to 20 if not specified
  home.findById({ _id: id })
    .then(items => {

      res.status(200).json({
        items: items
      });
      console.log('Items fetched successfully:', items);
    })
    .catch(err => {
      console.error('Error fetching items:', err);
      res.status(500).send('Internal Server Error');
    });
}
exports.deleteItem = (req, res, next) => {
  const itemId = req.params.id;
   home.findById({ _id: itemId })
        .then(items => {
          console.log('Items found for deletion:', items);
          if(items.photo) {

            fs.unlink(items.photo, (err) => {
              if (err) {
                console.error("Error deleting photo:", err);
              } else {
                console.log("Photo deleted successfully");
              }
            });
          }              
        })
  home.findByIdAndDelete(itemId)
    .then(() => {
     
      console.log('Item deleted successfully:', itemId);
      res.status(200).json({ message: 'Item deleted successfully' });
    })
    .catch(err => {
      console.error('Error deleting item:', err);
      res.status(500).send('Internal Server Error');
    });
}
exports.deleteAllItems = (req, res, next) => {
  home.find()
        .then(items => {
          console.log('Items found for deletion:', items);
          items.forEach(item => {
            // console.log('Items found for deletion:', item);
            if (item.photo) {
              fs.unlink(item.photo, (err) => {
                if (err) {
                  console.error("Error deleting photo:", err);
                } else {
                  console.log("Photo deleted successfully");
                }
              });
            }
          });
        }).then(() => {
         
       

  home.deleteMany({})
    .then(() => {
      

      console.log('All items deleted successfully');
      res.status(200).json({ message: 'All items deleted successfully' });
    })
    .catch(err => {
      console.error('Error deleting all items:', err);
      res.status(500).send('Internal Server Error');
    });
   })
};
    
    
    