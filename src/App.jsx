import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

const API_BASE_URL = "http://54.79.58.55"; // Backend public URL

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [expiryTime, setExpiryTime] = useState("ONE_HOUR");
  const [oneTimeDownload, setOneTimeDownload] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    setError("");
    setDownloadUrl("");
    setCopied(false);
    setProgress(0);

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiryTime", expiryTime);
    formData.append("oneTimeDownload", oneTimeDownload);

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      const data = res.data;

      // Use backend URL instead of window.location.origin
      setDownloadUrl(`${API_BASE_URL}/f/${data.shortCode}`);
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>QuickDrop 🚀</h1>
        <p style={styles.subtitle}>
          Share files instantly without revealing personal details
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />

        {file && (
          <div style={styles.fileInfo}>
            <p>
              <strong>Name:</strong> {file.name}
            </p>
            <p>
              <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <div style={styles.selectContainer}>
          <label style={styles.label}>Link Expiry</label>
          <select
            value={expiryTime}
            onChange={(e) => setExpiryTime(e.target.value)}
            style={styles.select}
          >
            <option value="TEN_MINUTES">10 Minutes</option>
            <option value="ONE_HOUR">1 Hour</option>
            <option value="TWENTY_FOUR_HOURS">24 Hours</option>
          </select>
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={oneTimeDownload}
            onChange={(e) => setOneTimeDownload(e.target.checked)}
          />
          <label>Delete after first download</label>
        </div>

        <button
          onClick={handleUpload}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>

        {loading && (
          <div style={styles.progressContainer}>
            <div
              style={{ ...styles.progressBar, width: `${progress}%` }}
            />
            <p style={styles.progressText}>{progress}%</p>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {downloadUrl && (
          <div style={styles.result}>
            <p style={styles.success}>✅ File Uploaded Successfully</p>

            <div style={styles.qrContainer}>
              <QRCodeCanvas
                value={downloadUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
              <p style={styles.scanText}>Scan QR to download</p>
            </div>

            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              {downloadUrl}
            </a>

            <button onClick={copyToClipboard} style={styles.copyButton}>
              {copied ? "Copied ✅" : "Copy Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles same as your previous App
const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(to right, #dbeafe, #f0f9ff)", padding: "20px" },
  card: { background: "white", width: "100%", maxWidth: "420px", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  title: { marginBottom: "5px", textAlign: "center" },
  subtitle: { textAlign: "center", color: "gray", marginBottom: "25px", fontSize: "14px", lineHeight: "1.5" },
  input: { width: "100%", marginBottom: "20px" },
  fileInfo: { background: "#f3f4f6", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", lineHeight: "1.6" },
  selectContainer: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" },
  select: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" },
  checkboxContainer: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", fontSize: "14px" },
  button: { width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" },
  progressContainer: { width: "100%", background: "#e5e7eb", borderRadius: "999px", marginTop: "20px", overflow: "hidden", height: "20px" },
  progressBar: { height: "100%", background: "#2563eb", transition: "width 0.2s ease" },
  progressText: { textAlign: "center", marginTop: "8px", fontWeight: "bold", color: "#1e3a8a", fontSize: "14px" },
  result: { marginTop: "25px", textAlign: "center" },
  success: { color: "green", marginBottom: "15px", fontWeight: "bold" },
  qrContainer: { marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
  scanText: { marginTop: "10px", color: "#6b7280", fontSize: "14px" },
  link: { display: "block", marginBottom: "15px", wordBreak: "break-all", color: "#2563eb", textDecoration: "none", fontSize: "14px" },
  copyButton: { padding: "10px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red", marginTop: "15px", textAlign: "center", fontSize: "14px" },
};

export default App;