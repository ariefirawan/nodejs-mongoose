const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  //_id will still be added automaticly as an ObjectId
  title: {
    type: String,
    require: true
  },
  imageUrl: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});


module.exports = mongoose.model('Product', productSchema);

// class Product {
//   constructor(title, imageUrl, price, desc, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = desc;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = new mongodb.ObjectId(userId);
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id}, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => console.log(err))
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//     .collection('products')
//     .find()
//     .toArray()
//     .then(products => {
//       console.log(products)
//       return products;
//     })
//     .catch(err => console.log(err));
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => console.log(err))
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db
//     .collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
//     .then(() => {
//       console.log('Delete!')
//     })
//     .catch(err => console.log(err))
//   }
// }

// module.exports = Product;