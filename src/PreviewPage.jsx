import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

const API_BASE_URL =
  "http://54.79.58.55:8080";

function PreviewPage() {

  const { shortCode } = useParams();

  const [fileInfo, setFileInfo] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchFileInfo();

  }, []);

  const fetchFileInfo = async () => {

    try {

      const res = await axios.get(
        `${API_BASE_URL}/api/files/info/${shortCode}`
      );

      setFileInfo(res.data);

    } catch (err) {

      setError(
        "File not found or expired"
      );
    }
  };

  if (error) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "red",
        }}
      >
        {error}
      </h2>
    );
  }

  if (!fileInfo) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Loading...
      </h2>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>QuickDrop 🚀</h1>

        <p style={styles.fileName}>
          {fileInfo.fileName}
        </p>

        <p>
          Size:{" "}
          {(
            fileInfo.fileSize /
            1024 /
            1024
          ).toFixed(2)} MB
        </p>

        <p>
          Expires At:
          {" "}
          {new Date(
            fileInfo.expiresAt
          ).toLocaleString()}
        </p>

        <a
          href={fileInfo.downloadUrl}
          style={styles.button}
        >
          Download File
        </a>
      </div>
    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to right, #dbeafe, #f0f9ff)",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.1)",
  },

  fileName: {
    fontWeight: "bold",
    marginBottom: "15px",
  },

  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default PreviewPage;