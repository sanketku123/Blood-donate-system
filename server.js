const express = require('express')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const mongoose=require("mongoose")
const session=require("express-session")
const app = express()
const { ObjectId } = require('mongoose').Types;
const PORT = process.env.PORT || 3000;

app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:"abc"
  }))
  app.use(express.urlencoded({extended:true}))
  const userSchema=new mongoose.Schema({
    role:{
        type:String,
        require:true
    
    
    },
    username:{
      type:String,
      require:true
  
  
    },
  
    password:{
      type:String,
      require:true,
  
    },Name:{
        type:String,
        require:true,
    },
    city:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    }
    ,blood:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    }
  })
  app.set('view engine', 'ejs');
  app.set("views",path.resolve("./views"))
  const user=mongoose.model("blood",userSchema)
  const user1=mongoose.model("userD",userSchema)
  const help=mongoose.model("help",userSchema)
  mongoose.connect("mongodb+srv://2211981349:sanket2022@user.onadiza.mongodb.net/?retryWrites=true&w=majority&appName=User").then(()=>{
    console.log("connect")
  }).catch(()=>{
    console.log("err");
  })
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve images from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the index.html file
app.get('/', (req, res) => {
if(!req.session.username)
    res.sendFile(path.join(__dirname, 'index.html'));
res.sendFile(path.join(__dirname, 'login.html'))
});

// Route to serve the help.html file
app.get('./help.html', (req, res) => {

    res.sendFile(path.join(__dirname, 'help.html'));
});

// Route to serve the donate.html file
app.get('./donate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'donate.html'));
});

// Route to serve the register.html file
app.get('./Register.html', (req, res) => {
   
    res.sendFile(path.join(__dirname, 'Register.html'));
});

// Route to serve the login.html file
app.get('./login.html', (req, res) => {
 
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/main.ejs',async (req, res) => {
    if(req.session.username){
    const s=await user1.find({})
    // Fetch data from MongoDB

    // Render main.html template with fetched data
  return  res.render('main', { s });

    }
    res.redirect("./login.html")
    
});

app.get("/admin",(req,res)=>{
    if(req.session.username){
        return res.sendFile(path.join(__dirname, 'admin.html'))
    }
    res.redirect("./login.html")
})
// Login endpoint
app.post("/login",async (req,res)=>{
    const body=req.body;

    const s=await user.findOne({username:body.username,password:body.password})
    const s1=await user.findOne({username:body.username})
    
    if(s){
      req.session.username=s.username;
     
      if(s.role=="admin"){
return res.redirect("/admin");
      }
   res.redirect('./main.ejs')
  }
  else if(s1){
    return res.status(401).send(`
    <script>
        alert('Invalid credentials');
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 200); // Redirect after 3 seconds
    </script>
`);
  }
  else{
    return res.status(401).send(`
    <script>
        alert('Not found please register');
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 200); // Redirect after 3 seconds
    </script>
`);
  }
  })

  app.post("/signup",async (req,res)=>{
   
    const body=req.body;
    
    const s=await user.findOne({username:body.username,password:body.password})
    const s1=await user.findOne({username:body.username})
    if(!body.role){
        return res.status(401).send(`
        <script>
            alert('select role');
            setTimeout(function() {
                window.location.href = 'Register.html';
            }, 200); // Redirect after 3 seconds
        </script>
      `);
    }
    if(body.role=='admin'){
        if(body.admin_password!="Admin123"){
            return res.status(401).send(`
            <script>
                alert('Admin password wrong');
                setTimeout(function() {
                    window.location.href = 'Register.html';
                }, 200); // Redirect after 3 seconds
            </script>
          `);
        }
    }
    if(s1){
        return res.status(401).send(`
  <script>
      alert('Email already register');
      setTimeout(function() {
          window.location.href = 'Register.html';
      }, 200); // Redirect after 3 seconds
  </script>
`);
    }
    
    if(!s){
      
    const result=await user.create({
        role:req.body.role,
     username:body.username,
      Name:body.Name,
  password:body.password,
  Name:body.Name
    })
    res.redirect("./login.html");
  }
  else{
  return res.status(401).send(`
  <script>
      alert('Already exit');
      setTimeout(function() {
          window.location.href = 'Register.html';
      }, 200); // Redirect after 3 seconds
  </script>
`);
  }
  })
  app.get("./donate2.html",(req,res)=>{
    if(req.session.username)
   return res.sendFile(path.join(__dirname, 'donate2.html'));
   return res.redirect("./login.html")
  })
 app.post("/detail",async (req,res)=>{
    const body=req.body;
    
    const t= await user1.findOne({username:body.username});

    if(req.session.username!=body.username){
        return res.status(401).send(`
        <script>
            alert('username not same');
            setTimeout(function() {
                window.location.href = 'donate2.html';
            }, 200); // Redirect after 3 seconds
        </script>
      `);
    }
    if(t){
        return res.status(401).send(`
        <script>
            alert('Already in the list if you want to update please update from profile');
            setTimeout(function() {
                window.location.href = 'main.ejs';
            }, 200); // Redirect after 3 seconds
        </script>
      `);
    }
    const result=await user1.create({
     username:body.username,
 city:body.city,
  Name:body.Name,
phone:body.phone,
blood:body.blood
    })
   
    res.redirect("./donate2.html");
 })
// Start the server
app.get("/profile.ejs",async (req,res)=>{
   if(req.session.username){
    const profile = await user1.findOne({username:req.session.username}); // Assuming there's only one profile in the database
   
   if(profile==null){
  
   const profile = await user.findOne({username:req.session.username})
   
    return  res.render('profile', { profile });
   }
 
   return res.render('profile', { profile });
}
return res.redirect("./login.html")
}
)
app.get("/Aprofile.ejs",async (req,res)=>{
    if(req.session.username){
     const profile = await user1.findOne({username:req.session.username}); // Assuming there's only one profile in the database
    
    if(profile==null){
   
    const profile = await user.findOne({username:req.session.username})
    
     return  res.render('Aprofile', { profile });
    }
  
    return res.render('Aprofile', { profile });
 }
 return res.redirect("./login.html")
 }
 )
app.post('/updateProfile', async (req, res) => {
    const { username,Name,phone,city,blood } = req.body;

  
    const profile = await user.findOneAndUpdate({username:req.session.username}, { username,Name,phone,city,blood }, { new: true });
      
        const profile1 = await user1.findOne({username:req.session.username});
        if(profile1!=null){
          
       const p=await user1.findOneAndUpdate({username:req.session.username}, { username,Name,phone,city,blood }, { new: true });
        }
        res.redirect('/profile.ejs');
   })
   app.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("./login.html")
   })
   //help
   app.post("/help",async (req,res)=>{
    const body=req.body
    

    if(body.username!=req.session.username){
        return res.status(401).send(`
        <script>
            alert('username not same');
            setTimeout(function() {
                window.location.href = 'help.html';
            }, 200); // Redirect after 3 seconds
        </script>
      `);
    }
    const result=await help.create({
        
     username:body.username,
      Name:body.Name,
 phone:body.phone,
 message:body.message
    })
    res.redirect("./help.html");
   })
   app.use(bodyParser.json());
   app.get('/userList', async (req, res) => {
    if(req.session.username){
    try {
        const users = await user.find();
        
       return res.render('user', { users});
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
      return  res.status(500).send('Error fetching data from MongoDB');
    }
}
    res.redirect("./login.html");
});
app.get('/donateList', async (req, res) => {
    if(req.session.username){
    try {
        const donations = await user1.find();
       
        return res.render('list', { donations });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
       return res.status(500).send('Error fetching data from MongoDB');
    }
}
res.redirect("./login.html");
});
   app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        const deletedUser = await user.findByIdAndDelete(userId);
       
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

// Route to delete donation by ID
app.delete('/donations/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        const deletedUser = await user1.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
    
});
app.get('/don', async (req, res) => {
   
    try {
        const userId = req.session.username;
      console.log(userId,"session")
        const deletedUser = await user1.findOneAndDelete({username:req.session.username});
        console.log(deletedUser,"delete")
        if (!deletedUser) {
            return   res.status(404).send(`
               <script>
                   alert('Not In list');
                   setTimeout(function() {
                       window.location.href = 'main.ejs';
                   }, 200); // Redirect after 3 seconds
               </script>
             `);
               
           }
         return  res.status(404).send(`
           <script>
               alert('SuccessFull');
               setTimeout(function() {
                   window.location.href = 'main.ejs';
               }, 200); // Redirect after 3 seconds
           </script>
         `);
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
}



    
);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
