import express, { response } from 'express';

const app=express();
app.use(express.json())
const PORT =process.env.PORT || 3000;

// app.get("/",(request,response)=>{
//   response.send("hello,World!");
// });

const mockUsers=[
  {
    id:1,username:"anson",displayName:"Anson"
  },
  {
    id:2,username:"Jack",displayName:"Jack"
  },
  {
    id: 3,
    username: "adam",
    displayName: "Adam",
  },
  {
    id: 4,
    username: "tina",
    displayName: "Tina",
  },
  {
    id: 5,
    username: "jason",
    displayName: "Jason",
  },
  {
    id: 6,
    username: "henry",
    displayName: "Henry",
  },
  {
    id: 7,
    username: "marilyn",
    displayName: "Marilyn",
  },
];

  app.get("/",(request,response)=>{
    response.status(201).send({msg:"hello"});
  });

  app.get("/api/users",(request,response)=>{
    response.send(mockUsers);
  });

  app.get("/api/users/:id",(request,response)=>{
    console.log(request.params);
    const parsedId=parseInt(request.params.id);
    console.log(parsedId);
    if(isNaN(parsedId))
    return response.status(400).send({msg:"Bad Request. Invalid ID"});
    const findUser=mockUsers.find((user)=>user.id ===parsedId);
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
  });

  app.post("/api/users", (request,response)=>{
   const {body}=request;
    const newUser={id: mockUsers[mockUsers.length-1].id+1, ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  });
app.get("/api/products",(request,response)=>{
  response.send([{id:123,name:"chicken breast",price:12.99}]);
});

app.listen(PORT,()=>{
  console.log(`Running on Port ${PORT}`);
});

