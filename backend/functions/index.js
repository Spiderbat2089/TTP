

const functions = require ("firebase-functions");
const logger = require("firebase-functions/logger");

const express = require("express");
const app = express(); 

app.use(express.json());





app.get ("/", (reg, res) => {
    return res.status (200).send("Hi there what is up");
});
    
exports.app = functions.https.onRequest(app);

// app.get("/", (req, res) => {
//     const user = req.query.user;
//     res.send(user + "!");
// });

// const users = [];
// app.post("/create_user",  (req, res) => {
    
//     const { user } = req.body;
    
//     users.push({username: user.username, password: user.password});

//     console.log(users);

//     res.json({loggedIn: true})
// })
// app.get("/users", (_,res) => {
//     res.json(users);
// });

// app.delete("/delete_user", (req, res, next) => 
// {
    
//     const {username, password} = req.body;

//     const existingUser = users.find(u => u.username === username && u.password === password);
//     console.log(existingUser);

//     if(existingUser === -1)
//     {
//         res.status(401).json({errorStatus: "Credentials did not match"});


//     }

//     users.splice(users.indexOf(existingUser), 1);
//     res.json(users)



// })



// app.listen(port, () =>{
//     console.log("Server started on port " + port)
// });




// const listings = [];
// app.post("/create_listing",  (req, res) => {
    
//     const { listing } = req.body;
    
//     listings.push({ title: listing.title, price: listing.price, description: listing.description});

//     console.log(listing);

//     res.json({listingCreated: true})
// })
// app.get("/listings", (_,res) => {
//     res.json(listings);
// });

// app.delete("/delete_listing", (req, res, next) => 
// {
    
//     const { listing } = req.body;

//     const existingListing = listings.findIndex(l => l.title === listing.title && l.price === listing.price && l.description === listing.description);

//     console.log(existingListing);

//     if(existingListing === -1)
//     {
//         res.status(401).json({errorStatus: "Credentials did not match"});
//     }

//     listings.splice(existingListing, 1);
//     res.json(listings)

// })