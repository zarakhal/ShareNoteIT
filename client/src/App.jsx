import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// IMPORT ROUTER
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// --- KOMPONEN UTAMA (ROUTING) ---
function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "50px",
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              backdropFilter: "blur(10px)",
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Kalau nyasar, balikin ke home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// --- PENJAGA PINTU (PROTECTED ROUTE) ---
// Kalau gak punya token, tendang ke /login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

// === HALAMAN AUTH (LOGIN/REGISTER) ===
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // Buat pindah halaman

  // Cek kalau udah login, langsung lempar ke dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error("Isi data dulu!");
    const load = toast.loading("Loading...");
    try {
      const url = isLogin
        ? "http://localhost:5000/login"
        : "http://localhost:5000/register";
      const res = await axios.post(url, form);
      toast.dismiss(load);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        toast.success(`Welcome, ${res.data.username}!`);
        navigate("/"); // PINDAH HALAMAN KE DASHBOARD
      } else {
        toast.success("Akun dibuat! Login sekarang.");
        setIsLogin(true);
      }
    } catch {
      toast.dismiss(load);
      toast.error("Gagal login/register.");
    }
  };

  return (
    <div style={{ marginTop: "20vh", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: 5 }}>
        ShareNoteIT
      </h1>
      <p style={{ color: "#8E8E93", marginBottom: 30 }}>
        Catatan kuliah modern.
      </p>
      <div className="glass-panel">
        <div
          style={{
            background: "rgba(0,0,0,0.05)",
            padding: 4,
            borderRadius: 14,
            display: "flex",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: 10,
              border: "none",
              background: isLogin ? "#fff" : "transparent",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: isLogin ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: 10,
              border: "none",
              background: !isLogin ? "#fff" : "transparent",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: !isLogin ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            }}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn-primary" type="submit">
            {isLogin ? "Masuk" : "Buat Akun"}
          </button>
        </form>
      </div>
    </div>
  );
}

// === HALAMAN DASHBOARD ===
function Dashboard() {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Ethical Hacking");
  const [file, setFile] = useState(null);

  // Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/notes").then((res) => {
      setNotes(res.data);
      setTimeout(() => setLoadingData(false), 500);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("See you!");
    navigate("/login"); // PINDAH HALAMAN KE LOGIN
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih file dulu!");
    const load = toast.loading("Mengupload...");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("uploader", user);
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/notes", formData);
      setNotes([res.data, ...notes]);
      toast.dismiss(load);
      toast.success("Berhasil diupload!");
      setShowUpload(false);
      setTitle("");
      setFile(null);
    } catch {
      toast.dismiss(load);
      toast.error("Gagal upload.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:5000/notes/${deleteTarget}`);
      setNotes(notes.filter((n) => n._id !== deleteTarget));
      toast.success("Folder dihapus!", { icon: "🗑️" });
      setDeleteTarget(null);
    } catch {
      toast.error("Gagal hapus.");
    }
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/notes/${editTarget._id}`, {
        title: editTarget.title,
      });
      setNotes(
        notes.map((n) =>
          n._id === editTarget._id ? { ...n, title: editTarget.title } : n
        )
      );
      toast.success("Nama folder diganti!", { icon: "✏️" });
      setEditTarget(null);
    } catch {
      toast.error("Gagal update.");
    }
  };

  const getTagColor = (sub) => {
    if (sub.includes("Web")) return "bg-orange";
    if (sub.includes("Mobile")) return "bg-purple";
    if (sub.includes("Jaringan")) return "bg-green";
    return "bg-blue";
  };

  const filtered = notes.filter(
    (n) =>
      filter === "" ||
      n.subject === filter ||
      n.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className="glass-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#1C1C1E",
              borderRadius: "50%",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {user.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Hai, {user}</div>
            <div style={{ fontSize: 11, color: "#8E8E93" }}>Mahasiswa</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,59,48,0.1)",
            color: "#FF3B30",
            border: "none",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Keluar
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="🔍 Cari folder..."
          onChange={(e) => setFilter(e.target.value)}
          style={{ margin: 0 }}
        />
        <button
          onClick={() => setShowUpload(!showUpload)}
          style={{
            width: 50,
            borderRadius: 14,
            border: "none",
            background: "#1C1C1E",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          {showUpload ? "✕" : "+"}
        </button>
      </div>

      <div className="filter-scroll">
        {[
          "All",
          "Ethical Hacking",
          "Pemrograman Web",
          "Pemrograman Mobile",
          "Jaringan Komputer",
        ].map((cat) => (
          <button
            key={cat}
            className={`chip ${
              filter === cat || (filter === "" && cat === "All") ? "active" : ""
            }`}
            onClick={() => setFilter(cat === "All" ? "" : cat)}
          >
            {cat === "All" ? "Semua" : cat}
          </button>
        ))}
      </div>

      {showUpload && (
        <div
          className="glass-panel"
          style={{ marginBottom: 20, animation: "fadeIn 0.3s" }}
        >
          <h3 style={{ marginTop: 0 }}>Upload Baru</h3>
          <form onSubmit={handleUpload}>
            <input
              placeholder="Nama Folder / Materi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select onChange={(e) => setSubject(e.target.value)}>
              <option>Ethical Hacking</option>
              <option>Pemrograman Web</option>
              <option>Pemrograman Mobile</option>
              <option>Jaringan Komputer</option>
            </select>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <button className="btn-primary" type="submit">
              Upload Sekarang
            </button>
          </form>
        </div>
      )}

      <div className="notes-grid">
        {loadingData ? (
          <div style={{ color: "#999" }}>Memuat folder...</div>
        ) : (
          filtered.map((note) => (
            <div
              key={note._id}
              className="folder-card"
              onClick={() => setPreviewData(note)}
            >
              <div style={{ flex: 1 }}>
                <span className={`tag ${getTagColor(note.subject)}`}>
                  {note.subject.includes("Hacking")
                    ? "HACKING"
                    : note.subject.includes("Web")
                    ? "WEB"
                    : note.subject.includes("Mobile")
                    ? "MOBILE"
                    : "JARKOM"}
                </span>
                <div style={{ marginTop: 15 }}>
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                    }}
                  >
                    {note.fileUrl.match(/\.(jpg|jpeg|png)$/i) ? "🖼️" : "📁"}
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {note.title}
                  </h4>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: "#8E8E93",
                    }}
                  >
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  paddingTop: 10,
                }}
              >
                <div style={{ display: "flex", gap: 5 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditTarget(note);
                    }}
                    style={{
                      background: "rgba(0,0,0,0.05)",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(note._id);
                    }}
                    style={{
                      background: "rgba(255,59,48,0.1)",
                      color: "#FF3B30",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🗑
                  </button>
                </div>
                <span
                  style={{ fontSize: 11, color: "#007AFF", fontWeight: 600 }}
                >
                  Buka &rarr;
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 50, marginBottom: 10 }}>🗑️</div>
            <div className="modal-title">Hapus Folder?</div>
            <div className="modal-desc">
              Folder ini akan hilang selamanya dan tidak bisa dikembalikan.
              Yakin?
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Ganti Nama Folder</div>
            <div className="modal-desc">
              Masukkan nama baru untuk folder ini.
            </div>
            <form onSubmit={confirmEdit}>
              <input
                value={editTarget.title}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, title: e.target.value })
                }
                autoFocus
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditTarget(null)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-confirm">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewData && (
        <div className="modal-overlay" onClick={() => setPreviewData(null)}>
          <div
            className="modal-glass"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <button
              onClick={() => setPreviewData(null)}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                border: "none",
                background: "rgba(0,0,0,0.1)",
                width: 30,
                height: 30,
                borderRadius: "50%",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
            <h3 className="modal-title" style={{ textAlign: "left" }}>
              {previewData.title}
            </h3>
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              {previewData.fileUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                <img
                  src={previewData.fileUrl}
                  className="preview-img"
                  alt="Preview"
                />
              ) : (
                <div
                  style={{
                    padding: 40,
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: 20,
                  }}
                >
                  <div style={{ fontSize: 60 }}>📄</div>
                  <p>Dokumen PDF / Word</p>
                </div>
              )}
            </div>
            <a
              href={previewData.fileUrl}
              target="_blank"
              className="btn-confirm"
              style={{ display: "block", textDecoration: "none" }}
            >
              Download File
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
