const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// 1. SETUP GAMBAR (Biar bisa diakses lewat link)
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 2. KONEKSI DATABASE (Ganti Link MongoDB Punya Kamu Disini!)
mongoose
  .connect("mongodb://127.0.0.1:27017/sharenoteit")
  .then(() => console.log("Database Nyala! 🔥"))
  .catch((err) => console.log("Database Error:", err));

// 3. MODEL (Bentuk Datanya)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

const NoteSchema = new mongoose.Schema({
  title: String,
  subject: String,
  fileUrl: String,
  uploader: String,
  date: { type: Date, default: Date.now },
});
const Note = mongoose.model("Note", NoteSchema);

// 4. ROUTE AUTH (Login & Register)
app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.json(user);
  } catch (e) {
    res.status(400).json("Error register");
  }
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(404).json("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Wrong password");

  const token = jwt.sign(
    { id: user._id, username: user.username },
    "rahasia123"
  );
  res.json({ token, username: user.username });
});

// 5. ROUTE NOTES (CRUD)
// Create (Upload)
app.post("/notes", upload.single("file"), async (req, res) => {
  const newNote = await Note.create({
    title: req.body.title,
    subject: req.body.subject,
    uploader: req.body.uploader,
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
  res.json(newNote);
});

// Read (Ambil Semua)
app.get("/notes", async (req, res) => {
  const notes = await Note.find().sort({ date: -1 });
  res.json(notes);
});

// Delete
app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

// Update Judul Catatan
// GANTI BAGIAN app.put DENGAN INI:

app.put("/notes/:id", async (req, res) => {
  console.log("🔄 Request Masuk: Update ID", req.params.id);
  console.log("📝 Data dikirim:", req.body);

  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );

    if (!note) {
      console.log("❌ Gagal: ID tidak ditemukan di Database");
      return res.status(404).json("Catatan tidak ditemukan");
    }

    console.log("✅ Berhasil Update:", note);
    res.json(note);
  } catch (e) {
    console.log(" ERROR:", e);
    res.status(500).json("Gagal update: " + e.message);
  }
});
app.listen(5000, () => console.log("Server jalan di port 5000 🚀"));
