import { Router } from "express";


const testRoute=Router();

testRoute.get("/", (req, res) => {
  return res.status(200).json({message:"Hello TechUp!"});
}); 

export default testRoute;