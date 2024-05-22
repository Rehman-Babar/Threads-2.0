import express, { urlencoded } from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import connectToDataBase from "./db/connectionDB.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import messageRoutes from './routes/messageRoutes.js'
import {v2 as cloudinary} from 'cloudinary'
import {app,server} from './socket/socket.js'
import path from 'path' 
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
})
connectToDataBase();


// MIDDLEWARE
app.use(express.json({limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieparser());

// ROUTER
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);


	app.use(express.static(path.join(__dirname, "/frentend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "frentend", "dist", "index.html"));
	});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
