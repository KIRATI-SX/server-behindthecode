import "dotenv/config";

// Import environment
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";
import testRoute from "./routes/testRoute.mjs";
import healthRoute from "./routes/healthRoute.mjs";
import postRoute from "./routes/postRoute.mjs";

// INITIAL VARIABLES
const app = express();
const port = process.env.PORT || 4000;

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:3000", // Frontend local (React แบบอื่น)
      "https://behindthecode-six.vercel.app/", // Frontend ที่ Deploy แล้ว
    ],
  })
);
app.use(express.json());

// ROUTES
app.use("/test", testRoute);
app.use("/health", healthRoute);
app.use('/posts',postRoute);



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
