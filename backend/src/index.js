const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");


const cors = require("cors");
app.use(cors());



let cart = [];

app.post("/cart/add", (req, res) => {
    const item = req.body;
    cart.push(item);
    res.status(200).json({ added: true });
});

app.get("/cart", (req, res) => {
    res.json(cart);
});

app.post("/cart/checkout", (req, res) => {
    cart = [];
    res.json({ checkout: true });
});

app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      // Save with the username in the filename
      const ext = path.extname(file.originalname);
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
    },
    {
        title: "Axe",
        price: 0,
        description: "I've got like 50 of these, so please come and take them off my hands! Please",
       image: "../../frontend/Images/product5.JPG"
    },
    {
        title: "Lumber",
        price: 2,
        description: "MASSIVE MASSIVE sale on this lumber.  You would be stupid not to take up this offer!",
       image: "../../frontend/Images/product6.JPG"
    },
    {
        title: "Chair",
        price: 12,
        description: "Chair chair, chair chair chair chair.  Do you really need more than that?",
       image: "../../frontend/Images/product7.JPG"
    },
    {
        title: "Chest",
        price: 45,
        description: "The loot-box of our time! Who knows what you might get?  You could get a lot of gold, or cool weapons, and you could even get human remains!",
       image: "../../frontend/Images/product8.JPG"
    },
    {
        title: "Lamp Post",
        price: 75,
        description: "NOT STOLEN, No questions and serious buyers please",
       image: "../../frontend/Images/product9.JPG"
    },
    {
        title: "Cursed Statue",
        price: 40,
        description: "This thing is scary, please someome take it off of my hands.  I think it keeps telling me to kill the king.",
       image: "../../frontend/Images/product10.JPG"
    },
    {
        title: "Bucket",
        price: 8,
        description: "Can be used for multiple things like filling it up with water.  I can't think of anymore, but you get the idea.",
       image: "../../frontend/Images/product11.JPG"
    },
    {
        title: "Ugly Plant",
        price: 4,
        description: "My wife says she loves it, but I think it is ugly.  So I decided to give it away.",
       image: "../../frontend/Images/product12.JPG"
    },
    {
        title: "Forge",
        price: 263,
        description: "My old forge, helped me make a lot of things.  I'm retiring so I an giving it away.  Good luck with moving it out.",
       image: "../../frontend/Images/product13.JPG"
    },
    {
        title: "The Kings Armory",
        price: 125,
        description: "shhhh, don't tell anyone I'm giving this out.",
       image: "../../frontend/Images/product14.JPG"
    },
    {
        title: "Box",
        price: 7.5,
        description: "One box, good for storing things.",
       image: "../../frontend/Images/product15.JPG"
    },
    {
        title: "Awesome Sword",
        price: 80,
        description: "I'm going to hate seeing this go, but I do have to give away everything I own.",
       image: "../../frontend/Images/product16.JPG"
    }
];

//http://localhost:3000/search?q=searchQuery
app.get('/search', async (req, res) => {
    const searchQuery = req.query.q;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const results = await performSearch(searchQuery);

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

async function performSearch(query) {
    const lowerCaseQuery = query.toLowerCase();

    // Simulate async behavior like a DB call
    return listings.filter(item =>
        item.title.toLowerCase().includes(lowerCaseQuery)
    );
}

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

