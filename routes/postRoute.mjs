import { Router } from "express";

import connectionPool from "../utils/db.mjs";
import { validatePost } from "../middlewares/validatePost.mjs";
import postController from "../controllers/postController.mjs";

const postRoute = Router();

postRoute.get("/", postController.readByQueryMessage);

postRoute.get("/:postId", postController.readById);

postRoute.put("/:postId", validatePost, postController.update);

postRoute.delete("/:postId", postController.deleteById);

postRoute.post("/", validatePost, postController.create);

export default postRoute;
