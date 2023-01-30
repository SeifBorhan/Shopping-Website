const mongoose= require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        lowercase: true,
        enum: ["phones", 'sports', 'books']
    }
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;