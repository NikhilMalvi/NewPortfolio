import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config";
import pageRouter from "./routes/pageRouter.js";
import adminRouter from "./routes/adminRouter.js";
import cors from "cors";
import path from "path";
import projectRouter from "./routes/projectRouter.js";
import contactRouter from "./routes/contactRouter.js";
import galleryRouter from "./routes/galleryRouter.js";

connectDB();

const app = express();

// app.use(helmet());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", pageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/project", projectRouter);

app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/contact", contactRouter);
app.use("/api/gallery", galleryRouter);
app.get("/api/health", (req, res) => {
  res.status(200).json({ alive: true });
});

app.get("/", (req, res) => res.send("api is working"));

// app.use(cors({
//   origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
//   credentials: true
// }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
