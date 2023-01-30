const Products= require('./models/products')
const mongoose = require("mongoose");


mongoose.connect(`mongodb+srv://ahmed_karara:xk4HmmGiuyMwVzzR@cluster0.cwmh7.mongodb.net/NetworksDB?retryWrites=true&w=majority`
, ({
   
})).then(() => {
           console.log("Mongoose Open!")
       })
    .catch(err => {
           console.log("Mongoose Failed!")
          console.log(err); 
        
        })


const seedProducts = [
    {
        name: 'IPhone 13 Pro',
       
        category: 'phones'
    },
    {
        name: 'Galaxy S21 Ultra',
        
        category: 'phones'
    },
    {
        name: 'Boxing Bag',
       
        category: 'sports'
    },
    {
        name: 'Tennis Racket',
        
        category: 'sports'
    },
    {
        name: 'Leaves of Grass',
        
        category: 'books'
    },{
        name:'The Sun and Her Flowers',
        
        category:'books'

    }
]
Products.insertMany(seedProducts)
    .then(data => console.log(data))
    .catch(err => console.log(err));