require('dotenv').config()
var express = require('express');
var path = require('path');
const session = require('express-session');
var app = express();
const Products= require('./models/products');
const mongoose= require('mongoose');
const User = require('./models/user');
const flash = require('connect-flash');
// mongoose.connect('mongodb://localhost:27017/NetworksProj')
//     .then(() => {
//         console.log("Mongoose Open!")
//     })
//     .catch(err => {
//         console.log("Mongoose Failed!")
//         console.log(err);

//     })

    // mongoose.connect(`mongodb+srv://ahmed_karara:xk4HmmGiuyMwVzzR@cluster0.cwmh7.mongodb.net/NetworksDB?retryWrites=true&w=majority`
    // , ({
      
    // })).then(() => {
    //            console.log("Mongoose Open!")
    //        })
    //     .catch(err => {
    //            console.log("Mongoose Failed!")
    //           console.log(err); 
            
    //         })
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwmh7.mongodb.net/NetworksDB?retryWrites=true&w=majority`
            , ({
                useNewUrlParser: true,
                useUnifiedTopology: true
            }))
        
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



const MongoDBStore = require("connect-mongo");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    console.log('connection open!');
})

// const store = new MongoDBStore({
//     url: "mongodb://localhost:27017/NetworksProj",
//     secret:'santa',
//     touchAfter: 24 * 60 * 60
// })

const sessionConfig = {
    secret:'123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    ,
    store:MongoDBStore.create({mongoUrl:`mongodb+srv://ahmed_karara:xk4HmmGiuyMwVzzR@cluster0.cwmh7.mongodb.net/NetworksDB?retryWrites=true&w=majority`}),
}

app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash('error');
  next();
})



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',(req,res)=>{
res.render('login')

})

app.post('/login',async (req,res)=>
{
  
  const { username, password } = req.body
  const user = await User.findOne({username:username,password:password})
  const products= await Products.find();  
  if(user){
    console.log('Loggedin')
    req.session.user= user;
    res.render('home',{products});
  }
  else {
  
    console.log('Error!')
    req.flash('error', 'username or password is incorrect')
    res.redirect('/')

  }

})
app.get('/registration',(req,res)=>{
  res.render('registration')
})
app.post('/registration',async (req,res)=>
{
  try{
  const { username, password } = req.body
  const user = await User.findOne({username:this.username,password:this.password})
  console.log(user);

    console.log('Account Created!')
    const newUser = await new User({ username, password});
   // req.session.user = user;
    await newUser.save() 
    res.redirect('/home'); 
  }
  catch(e){
    req.flash('error','Username is already taken!!');
    res.redirect('/registration')
   // throw 'Account already exists!'
  }
 
})
app.get('/home',(req,res)=>{
  const {user}=req.session
  if(user){
  res.render('home')
}
else{
  req.flash('error','you must be logged in first!');
  res.redirect('/');
}
})
app.post('/home',(req,res)=>{
  const {user}=req.session
  if(user){
  const result = req.body.Search
  res.render('home')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.get('/sports',(req,res)=>{
  const {user}=req.session
  if(user){
  res.render('sports')}
  else
  {    req.flash('error','you must be logged in first!')
  res.redirect('/');
    
  }
})


app.get('/phones',(req,res)=>{
  const {user}=req.session
  if(user){
  res.render('phones')}
  else{
    req.flash('error','you must be logged in first!')
  res.redirect('/');
    
  }
})
app.get('/books',(req,res)=>{
  const {user}=req.session
  if(user){
  res.render('books')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.get('/galaxy',(req,res)=>{
  const { user } = req.session;
  if(user){
  res.render('galaxy')}
  else
  {
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})
app.post('/galaxy',async (req,res)=>{
  const {user}= req.session;
  if(user){
  const cart= user.cart;
  const prod= await Products.findOne({name:"Galaxy S21 Ultra"})
  if(cart.includes(prod._id.toString())){
    req.flash('error','product already added to cart')
    res.redirect('/galaxy')
  }
  else{
  cart.push(prod._id);
  const var1= await User.findByIdAndUpdate(user._id,{cart:cart})
  await var1.save();
  req.flash('success','product successfully added to cart!');
  res.redirect('/galaxy')
}
  }
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.get('/iphone',async (req,res)=>{
  const {user} = req.session;
  if(user){
  res.render('iphone',{user})}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.post('/iphone',async (req,res)=>{
  const {user}= req.session;
  if(user){
  const cart= user.cart;
  const prod= await Products.findOne({name:"IPhone 13 Pro"})
  
  if(cart.includes(prod._id.toString())){
    req.flash('error','product already added to cart')
    res.redirect('/iphone')
  }
  else{
  cart.push(prod._id);
  const var1= await User.findByIdAndUpdate(user._id,{cart:cart})
  await var1.save();
  req.flash('success','product successfully added to cart!');
  res.redirect('/iphone')
}
  }
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
 
})

app.get('/searchresults',(req,res)=>{
  const {user}= req.session
  if(user){
  res.render('searchresults')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})
app.post('/searchresults',async (req,res)=>{
  const {user}= req.session
  if(user){
  const result = req.body.Search
  const products= await Products.find();  
  res.render('searchresults',{products,result})}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.get('/sun',(req,res)=>{
  const {user}=req.session
  if(user){
  res.render('sun')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.post('/sun',async (req,res)=>{
  const {user}= req.session;
  if(user){
  const cart= user.cart;
  const prod= await Products.findOne({name:"The Sun and Her Flowers"})
  if(cart.includes(prod._id.toString())){
    req.flash('error','product already added to cart')
    res.redirect('/sun')
  }
  else{ 
  cart.push(prod._id);
  const var1= await User.findByIdAndUpdate(user._id,{cart:cart})
  await var1.save();
  req.flash('success','product successfully added to cart!');
  res.redirect('/sun')
}
  }
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
 
})
app.get('/leaves',(req,res)=>{
  const {user} =req.session
  if(user){
  res.render('leaves')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.post('/leaves',async (req,res)=>{
  const {user}= req.session;
  if(user){
  const cart= user.cart;
  const prod= await Products.findOne({name:"Leaves of Grass"})
  if(cart.includes(prod._id.toString())){
    req.flash('error','product already added to cart')
    res.redirect('/leaves')
  }
  else{
  cart.push(prod._id);
  const var1= await User.findByIdAndUpdate(user._id,{cart:cart})
  await var1.save();
  req.flash('success','product successfully added to cart!');
  res.redirect('/leaves')
}
  }
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})

app.get('/cart',async (req,res)=>{
  const {user}=req.session
  if(user){
  const x=[];
  for(let itemID of user.cart){
    const prod = await Products.findById(itemID);
    x.push(prod);
  }
  res.render('cart',{user,x})}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})


app.get('/boxing',(req,res)=>{
  const {user} =req.session
  if(user){
  res.render('boxing')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})
app.post('/boxing',async (req,res)=>{
  const {user}= req.session;
  if(user){
  const cart= user.cart;
  const prod= await Products.findOne({name:"Boxing Bag"})
  if(cart.includes(prod._id.toString())){
    console.log('product already added to cart')
    req.flash('error','product already added to cart')
    res.redirect('/boxing');
  }
  else{
  cart.push(prod._id);
  const var1= await User.findByIdAndUpdate(user._id,{cart:cart})
  await var1.save();
  req.flash('success','product successfully added to cart!');
  res.redirect('/boxing')
}}
else{
  req.flash('error','you must be logged in first!')
  res.redirect('/');
}

 
})
app.get('/tennis',(req,res)=>{
  const {user}=req.session
  if(user){
  res.render('tennis')}
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
})
app.post('/tennis',async (req,res)=>{
  const {user}= req.session;
  if(user){
  const cart= user.cart;
  const prod= await Products.findOne({name:"Tennis Racket"})
  if(cart.includes(prod._id.toString())){
    req.flash('error','product already added to cart')
    res.redirect('/tennis')
  }
  else{
  cart.push(prod._id);
  const var1= await User.findByIdAndUpdate(user._id,{cart:cart})
  await var1.save();
  req.flash('success','product successfully added to cart!');
  res.redirect('/tennis')
}
  }
  else{
    req.flash('error','you must be logged in first!')
    res.redirect('/');
  }
 
})

app.get('/logout',(req,res)=>{
  req.flash('error','logout success')
  req.session.destroy();
  res.redirect('/')

})

var port =process.env.PORT || 3000
app.listen(port,()=>{

console.log(`listening on port ${port}`)

});
