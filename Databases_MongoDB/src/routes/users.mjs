import { request, Router } from "express";
import { query, validationResult, checkSchema, matchedData} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import {createUserValidationSchema} from '../utils/validationSchemas.mjs'
import { resolveIndexByUserId } from "../utils/middleware.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
   
    console.log(request.session.id);
    request.sessionStore.get(request.session.id,(err,sessionData)=>{
      if(err)
      {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    })
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
    // if(!filter && !value) return response.send(mockUsers);
  }
);

router.get("/api/users/:id",resolveIndexByUserId, (request, response) => {
  
  const {findUserIndex}=request;
  const findUser=mockUsers[findUserIndex];
  if(!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.post("/api/users",checkSchema(createUserValidationSchema),async(request,response)=>{
  
  const result=validationResult(request);
  if(!result.isEmpty()) return response.status(400).send(result.array());
  const data =matchedData(request);
  console.log(data);
  const newUser=new User(data);
  try{
    const savedUser=await newUser.save();
    return response.status(201).send(savedUser);

  } catch(err){
    console.log(err);
    return response.sendStatus(400);
  }
});

/*
 router.post(
  "/api/users",checkSchema(createUserValidationSchema), 
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);

    
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);
*/

router.put("/api/users/:id",resolveIndexByUserId, (request, response) => {
  const {
    body,
    findUserIndex
  } = request;
  
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id",resolveIndexByUserId, (request, response) => {
  const {
    body,findUserIndex} = request;
  
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id",resolveIndexByUserId, (request, response) => {
  const {
    findUserIndex
  } = request;
  
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;