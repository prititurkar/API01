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
       
         `\n${Date.now()}: ${req.method}:${req.path}`,
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
    // console.log("I am in get route",req.myUserName);
    return res.json(users);
});

app.route("/api/users/:id").get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
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
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", id: users.length });
    })

});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

