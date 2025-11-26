import express from "express";
import dotenv from "dotenv";
import { fetchPastPapers } from "./scraper/pastpaperScraper.js";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/api/search", async (req, res) => {
  const { year, subject } = req.query;

  if (!year || !subject)
    return res.status(400).json({ error: "year & subject required" });

  const papers = await fetchPastPapers(year, subject);
  res.json({ papers });
});

// Proxy download endpoint
app.get("/api/download", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("PDF URL required");

  try {
    const response = await axios.get(url, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=pastpaper.pdf");

    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Download failed", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
