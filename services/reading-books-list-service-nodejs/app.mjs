import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const NOTE_MODIFY = "Please note that changes are not persisted.";

// Dummy list of books with hardcoded UUIDs
const dummyBooks = [
  {
    id: "1d4c9647-5e62-4f1d-9c30-e1f25c6d0e73",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    status: "read",
  },
  {
    id: "be8c8194-0342-4ed7-bd64-47ad47f214b6",
    title: "1984",
    author: "George Orwell",
    status: "to_read",
  },
  {
    id: "660f6db1-1390-460d-9c0b-df7a4028ff4e",
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    status: "reading",
  },
];

// add a book - request body should contain a title, status, and an author
app.post("/reading-list/books", (req, res) => {
  const { title, author, status } = req.body;
  const uuid = uuidv4();

  if (!(status === "read" || status === "to_read" || status === "reading")) {
    return res.status(400).json({
      error: "Status is invalid. Accepted statuses: read | to_read | reading",
    });
  }
  if (!title || !author || !status) {
    return res.status(400).json({ error: "Title, Status or Author is empty" });
  }

  return res.status(201).json({ uuid, title, author, status, note: NOTE_MODIFY });
});

// update status of a book by uuid
app.put("/reading-list/books/:uuid", (req, res) => {
  const { status } = req.body;
  const uuid = req.params.uuid;

  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "Missing or invalid UUID" });
  }
  if (!(status === "read" || status === "to_read" || status === "reading")) {
    return res.status(400).json({
      error: "Status is invalid. Accepted statuses: read | to_read | reading",
    });
  }

  return res.json({ uuid, status, note: NOTE_MODIFY });
});

// get the list of books (no note here)
app.get("/reading-list/books", (_, res) => {
  return res.json({ books: dummyBooks });
});

// get a book by uuid (no note here)
app.get("/reading-list/books/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "Missing or invalid UUID" });
  }

  const book = dummyBooks.find((book) => book.id === uuid);
  if (!book) {
    return res.status(404).json({ error: "UUID does not exist" });
  }

  return res.json(book);
});

// delete a book by uuid
app.delete("/reading-list/books/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "Missing or invalid UUID" });
  }

  return res.json({ uuid, note: NOTE_MODIFY });
});

// health check
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.use("*", (_, res) => {
  return res.status(404).json({ error: "The requested resource does not exist on this server" });
});

export default app;