import { Router } from "express";

import connectionPool from "../utils/db.mjs";

const postRoute = Router();

postRoute.get("/", async (req, res) => {
  try {
    const { page , limit } = req.body;
    const {category, keyword}=req.query;
    const currentPage = Number(page) ||1;
    const currentLimit = Number(limit) ||6;
    const offset = (currentPage - 1) * currentLimit;

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`category ILIKE $${paramIndex}`);
      params.push(`%${category}%`);
      paramIndex++;
    }

    if (keyword) {
      conditions.push(
        `(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`,
      );
      params.push(`%${keyword}%`);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    // Count total posts matching the filters
    const countQuery = `SELECT COUNT(*) FROM posts${whereClause}`;
    const countResult = await connectionPool.query(countQuery, params);
    const totalPosts = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / currentLimit);

    // Fetch paginated posts
    const dataQuery = `SELECT * FROM posts${whereClause} ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const dataParams = [...params, currentLimit, offset];
    const result = await connectionPool.query(dataQuery, dataParams);

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage,
      limit: currentLimit,
      posts: result.rows,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

postRoute.get("/:postId", async (req, res) => {
  try {
    const { id } = _req.params;
    const query = `SELECT * FROM posts WHERE id = $1`;
    const result = await connectionPool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res
      .status(200)
      .json({ message: "Get post successfully", data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Server could not read post because database connection",
    });
  }
});

postRoute.put("/:postId", async (req, res) => {
  try {
    const id = req.params.postId;
    const { title, content, image, category_id, description } = req.body;
    const query = `UPDATE posts SET title = $2, content = $3,image=$4,category_id=$5,description=$6 WHERE id = $1`;
    const result = await connectionPool.query(query, [
      id,
      title,
      content,
      image,
      category_id,
      description,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res
      .status(200)
      .json({ message: "Updated post successfully", data: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

postRoute.delete("/:postId", async (req, res) => {
  try {
    const id = req.params.postId;
    const query = `DELETE FROM posts WHERE id = $1`;
    const result = await connectionPool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res
      .status(200)
      .json({ message: "Deleted post successfully", data: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

postRoute.post("/", async (req, res) => {
  try {
    const { title, content, image, category_id, description } = req.body;
    const query = `INSERT INTO posts (title, content, image, category_id, description) VALUES ($1, $2, $3, $4, $5)`;
    const result = await connectionPool.query(query, [
      title,
      content,
      image,
      category_id,
      description,
    ]);

    return res
      .status(201)
      .json({ message: "Post created successfully", data: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

export default postRoute;
