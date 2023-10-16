import express from "express";

import { addBook,getBook,updateBook,deleteBook} from "../controllers/book.js";

const router = express.Router();

router.post("/add",addBook);
router.get("/mod",getBook);
router.put("/:ref",updateBook);
router.delete("/:ref",deleteBook);

export default router;