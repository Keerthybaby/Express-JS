import express from 'express';

const app=express();
const PORT =process.env.PORT || 3000;

// app.get("/",(request,response)=>{
//   response.send("hello,World!");
// });

  app.get("/",(request,response)=>{
    response.status(201).send({msg:"hello"});
  });

  app.get("/api/users",(request,response)=>{
    response.send([
      {
        id:1,username:"anson",displayName:"Anson"
      },
      {
        id:2,username:"Jack",displayName:"Jack"
      },
      {
        id:3,username:"adam",displayName:"Adam"
      }
    ]);
  });

app.get("/api/products",(request,response)=>{
  response.send([{id:123,name:"chicken breast",price:12.99}]);
});

app.listen(PORT,()=>{
  console.log(`Running on Port ${PORT}`);
});

