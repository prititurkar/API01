const express = require('express');
const fs = require('fs');

const { json } = require('stream/consumers');
const app = express();
const PORT = 8000;
//middelware-plugin
app.use(express.urlencoded({extended: false}));

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
app.get("/api/users",(req, res) =>{
    return res.json(users);
});

app.route("/api/users/:id").get((req, res) =>{
    const id =Number(req.params.id);
    const user = users.find(user => user.id ===id);
    return res.json(user);
})
.patch((req, res)=>{
    //edit user with id
   return res.json({status: "pending"})
})
.delete((req, res)=>{
    const id = Number(req.params.id);

    //  File se fresh data read karo
    const data = JSON.parse(fs.readFileSync("./MOCK_DATA.json", "utf-8"));

    //  Id match na hone wale users rakho
    const updatedUsers = data.filter(user => user.id !== id);

    // File ko dobara write karo
    fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(updatedUsers));

    return res.json({ status: "Deleted successfully" });
});

app.post("/api/users", (req, res) => {
    const body = req.body;
   users.push({...body, id:users.length+1});
   fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err , data)=>{
     return res.json({ status: "success", id: users.length});
   })
    
});


app.listen(PORT, ()=> console.log(`Server started at PORT: ${PORT}`));