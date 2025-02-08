import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { getUsers, findOne, findByEmail, addUser, updateUser, removeUser } from "./user.database";
import { User } from "./user.interface";

const router: Router = Router();

/*  
// Fetch all users
*/
router.get("/users", async (req: Request, res: Response): Promise<void> => {
  const users = await getUsers();
  if (!users.length) {
    res.status(404).json({ error: "No users found" });
    return;
  }
  res.status(200).json({ totalUsers: users.length, users });
});

/*  
// Fetch a single user by ID
*/
router.get("/user/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await findOne(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json(user);
});

/*  
// Register a new user
*/
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const existingUser = await findByEmail(email);
  if (existingUser) {
    res.status(400).json({ error: "Email is already registered" });
    return;
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    password,
  };

  await addUser(newUser);
  res.status(201).json({ newUser });
});

/*  
// Login a user
*/
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await findByEmail(email);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  res.status(200).json({ user });
});

/*  
// Update user by ID
*/  
router.put("/user/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const user = await findOne(id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const updatedUser: User = { id, username, email, password };
  await updateUser(id, updatedUser);

  res.status(200).json({ updatedUser });
});

/*  
// Delete user by ID
*/
router.delete("/user/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await findOne(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await removeUser(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});

export default router;
