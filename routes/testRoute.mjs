import { Router } from "express";


const testRoute=Router();

testRoute.get("/", (req, res) => {
  res.send("Hello TechUp!");
}); 

export default testRoute;