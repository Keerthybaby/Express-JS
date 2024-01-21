import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import mongoStore from "connect-mongo";
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
  .connect("mongodb://localhost/express_tutorial")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: mongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  console.log(request.sessionID);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

const PORT = process.env.PORT || 3000;
/*

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited=true;
  response.cookie("hello","world",{maxAge:30000,signed:true});
  response.status(201).send({ msg: "hello" });
});
 
app.post('/api/auth',(request,response)=>{
  const {body:{username,password}}=request;
  const findUser=mockUsers.find((user)=>user.username===username);
  if(!findUser || findUser.password !== password)
  return response.status(401).send({msg:"BAD CREDENTIALS"});

  request.session.user=findUser;
  return response.status(200).send(findUser);
})
 
app.get("/api/auth/status",(request,response)=>{
  request.sessionStore.get(request.sessionID,(err,session)=>{
console.log(session);
  });
  return request.session.user ? response.status(200).send(request.session.user)
  :response.status(401).send({msg:"Not Authenticated"});
});

app.post("/api/cart",(request,response)=>{
  if(!request.session.user) return response.sendStatus(401);
  const {body:item}=request;
  const{cart}=request.session;
  if(cart){
    cart.push(item);
  } 
  else{
    request.session.cart=[item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart",(request,response)=>{
  if(!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? [])
})
*/

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
