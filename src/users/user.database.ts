import pool from "../db";
import { User } from "./user.interface";
import bcrypt from "bcryptjs";

/*  
// Fetch all users from the database
*/
export const getUsers = async (): Promise<User[]> => {
  const [rows]: any = await pool.query("SELECT * FROM users");
  return rows as User[];
};

/*  
// Find a user by ID
*/
export const findOne = async (id: string): Promise<User | null> => {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length ? (rows[0] as User) : null;
};

/*  
// Find a user by Email
*/
export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows.length ? (rows[0] as User) : null;
};

/*  
// Add a new user to the database
*/
export const addUser = async (user: User): Promise<void> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await pool.query(
    "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
    [user.id, user.username, user.email, hashedPassword]
  );
};

/*  
// Update user details in the database
*/
export const updateUser = async (id: string, user: User): Promise<void> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await pool.query(
    "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
    [user.username, user.email, hashedPassword, id]
  );
};

/*  
// Remove user from the database
*/
export const removeUser = async (id: string): Promise<void> => {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
};
