const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const path = require("path");


const cors = require("cors");
app.use(cors());
app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      // Save with the username in the filename
      const ext = path.extname(file.originalname); // like .jpeg or .png
      cb(null, `${req.body.username}_icon${ext}`);
    }
});
  
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Max file size: 5MB
});


app.use(express.json());


const port = 3000



app.get ("/", (reg, res) => {
    return res.status (200).send("Hi there what is up");
});
app.get("/", (req, res) => {
    const user = req.query.user;
    res.send(user + "!");
});

const users = [];




app.post("/create_user", upload.single("img"), (req, res) => {
    const { username, password, role = "Adventurer", description = "No description available." } = req.body;
    const iconPath = req.file ? req.file.path : "images/SkullProfile.jpg";

    users.push({
        username,
        password,
        iconPath,
        role,
        description
    });

    console.log(users); // Debug log
    res.status(200).json({ loggedIn: true, username, icon: iconPath });
});

app.get("/users", (_,res) => {
    res.json(users);
});

app.delete("/delete_user", (req, res, next) => 
{
    
    const {username, password} = req.body;

    const existingUser = users.find(u => u.username === username && u.password === password);
    console.log(existingUser);

    if(existingUser === -1)
    {
        res.status(401).json({errorStatus: "Credentials did not match"});


    }

    users.splice(users.indexOf(existingUser), 1);
    res.json(users)



})
app.get("/profile/:username", (req, res) => {
    const { username } = req.params;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    //Used this as a placeholder if user doesn't input anything
    const role = user.role || "Peasant";
    const description = user.description || "No description provided.";

    res.json({
        username: user.username,
        role,
        description,
        iconPath: `http://localhost:3000/${user.iconPath.replace(/\\/g, "/")}` 
    });
});



  
//Listing template:  {title: "", price: 0, description: "", image: "../../frontend/Images/"}
//Thank me later, you know you will
const listings = [
    {
        title: "John's Trusty Sword",
        price: 15,
        description: "My sword I have been using for 13 years. In great condition! Definitely won't break on the next hit.",
        image: "../../frontend/Images/product1.JPG"
    },
    {
        title: "Machete",
        price: 20,
        description: "Used to carve meat, and wasn't used for illegal activity.",
       image: "../../frontend/Images/product2.JPG"
    },
    {
        title: "Shield",
        price: 5,
        description: "My father's shield used in the battle of Big Creek River. I know what I got, so no price changes.",
       image: "../../frontend/Images/product3.JPG"
    },
    {
        title: "Sword of The Gods",
        price: 150,
        description: "Found by the old mill. Looks cool, but tells me to commit crimes. Selling for safety.",
       image: "../../frontend/Images/product4.JPG"
    }
];
app.post("/create_listing",  (req, res) => {
    
    const { listing } = req.body;
    
    listings.push({ title: listing.title, price: listing.price, description: listing.description, image: listing.image});

    console.log(listing);

    res.json({listingCreated: true})
})
app.get("/listings", (_,res) => {
    res.json(listings);
});

app.delete("/delete_listing", (req, res, next) => 
{
    
    const { listing } = req.body;

    const existingListing = listings.findIndex(l => l.title === listing.title && l.price === listing.price && l.description === listing.description);

    console.log(existingListing);

    if(existingListing === -1)
    {
        res.status(401).json({errorStatus: "Credentials did not match"});
    }

    listings.splice(existingListing, 1);
    res.json(listings)

});

app.listen(port, () => {
    console.log("Example app listening on port " + port)
});

