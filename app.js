const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const Register = require('./models/register');
require('./db/connection');
const bcrypt = require('bcryptjs')
require('dotenv').config()


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const templatePath = path.join(__dirname, './templates');
app.set('view engine', 'hbs');
app.set('views', templatePath);



app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, subject, password, confirmPassword } = req.body;
        

        
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        const user = new Register({
            name,
            email,
            subject,
            password,
            confirmPassword
        });
        
        const token = await user.generateAuthToken();
        console.log(SECRET_KEY);

        const data = await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(400).send(error);
    }
}); 

app.post('/login',async(req,res)=>{
    try{ 
      const email = req.body.email;
      const password = req.body.password;
      
      const check = await Register.findOne({'email':email})
      
      const match = bcrypt.compare(password,check.password)
      const token = await check.generateAuthToken();

      if(match){
        res.status(201).send("welcome to home page")
      }else{
        res.send("Invalid details")
      }

    }catch(error){
    res.status(400).send("Invalid details")
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
