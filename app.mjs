import "dotenv/config";

// Import environment
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

// INITIAL VARIABLES
const app = express();
const port = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/health/db", async (req, res) => {
  try {
    await connectionPool.query("select 1");
    res.json({ db: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "down" });
  }
});

app.post("/assignments", async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } =
      req.body;

    const query = `INSERT INTO posts (title,image,category_id,description,content,status_id) 
          VALUES ($1,$2,$3,$4,$5,$6)`;
    const values = [title, image, category_id, description, content, status_id];
    const result = await connectionPool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message:
          "Server could not create post because there are missing data from client",
      });
    }

    return res.status(201).json({ message: "Created post successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Server could not create post because database connection",
    });
  }
});

// SERVER
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
