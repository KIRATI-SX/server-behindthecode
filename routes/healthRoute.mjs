import { Router } from "express";

const healthRoute = Router();

healthRoute.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

healthRoute.get("/db", async (req, res) => {
  try {
    await connectionPool.query("select 1");
    res.json({ db: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "down" });
  }
});

export default healthRoute;
