import pool from "../db";
import { Product, UnitProduct } from "./product.interface";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid"; // Generate UUIDs

/* Fetch all products */
export const getProducts = async (): Promise<UnitProduct[]> => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM products");
  return rows as UnitProduct[];
};

/* Find a product by ID */
export const findOne = async (id: string): Promise<UnitProduct | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  return rows.length ? (rows[0] as UnitProduct) : null;
};

/* Add a new product with UUID */
export const addProduct = async (product: Product): Promise<UnitProduct | null> => {
  const { name, price, quantity, image } = product;
  const id = uuidv4(); // Generate UUID

  await pool.query(
    "INSERT INTO products (id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)",
    [id, name, price, quantity, image]
  );

  // Fetch and return the newly inserted product
  return findOne(id);
};

/* Update a product */
export const updateProduct = async (id: string, product: Product): Promise<UnitProduct | null> => {
  const { name, price, quantity, image } = product;

  await pool.query(
    "UPDATE products SET name = ?, price = ?, quantity = ?, image = ? WHERE id = ?",
    [name, price, quantity, image, id]
  );

  return findOne(id); // Return the updated product
};

/* Remove a product */
export const removeProduct = async (id: string): Promise<void> => {
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
};
