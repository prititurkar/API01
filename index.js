const express = require('express');
const fs = require('fs');
const users = require("./MOCK_DATA.json");
const { json } = require('stream/consumers');
const app = express();
const PORT = 8000;
//middelware-plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
 
    fs.appendFile(
       
        "log.txt",
       
         `\n${Date.now()}:${req.ip} ${req.method}:${req.path}`,
     (err) => {
        if(err) console.log(err);
         next();
         }
        );
    // return res.json({msg: "Hello from middleware 1"});
    // req.myUserName="prititurkar.dev";
   
});

app.use((req, res, next) => {
    console.log("hello from middleware 2");
    // return res.json({msg: "Hello from middleware 1"});
    // return res.end("hey");
    next();
});

//routes....

app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

//Rest API
app.get("/api/users", (req, res) => {
    // console.log(req.header);
    res.setHeader("X-MyName","priti turkar");//custom header
    // console.log("I am in get route",req.myUserName);
    return res.json(users);
});

app.route("/api/users/:id").get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if(!user) return res.status(404).json({error: "user not found"});
    return res.json(user);
})
    .patch((req, res) => {
        //edit user with id
        return res.json({ status: "pending" })
    })
    .delete((req, res) => {
        //delete user with id
        return res.json({ status: "pending" });
    });

app.post("/api/users", (req, res) => {
    const body = req.body;
    if(!body || !body.name || !body.lastname){
        return res.status(400).json({msg: 'All fields are req...'});
     }
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({ status: "success", id: users.length });
    })

});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

