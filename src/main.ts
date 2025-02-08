import express from "express";
import userRoutes from "./users/users.routes";
import productRoutes from "./products/product.routes"; 
import pool from "./db"; 

const app = express();
app.use(express.json());


app.use("/", userRoutes);
app.use("/", productRoutes); 

const PORT = process.env.PORT || 7000;


(async () => {
  try { 
    await pool.query("SELECT 1");
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
  }
})();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
