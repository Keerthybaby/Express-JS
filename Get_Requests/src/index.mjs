import express from 'express';

const app=express();
const PORT =process.env.PORT || 3000;

// app.get("/",(request,response)=>{
//   response.send("hello,World!");
// });

  app.get("/",(request,response)=>{
    response.status(201).send({msg:"hello"});
  });

  
app.listen(PORT,()=>{
  console.log(`Running on Port ${PORT}`);
});

