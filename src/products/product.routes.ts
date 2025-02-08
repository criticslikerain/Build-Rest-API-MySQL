import { Router, Request, Response } from "express";
import { getProducts, findOne, addProduct, updateProduct, removeProduct } from "./product.database";
import { Product } from "./product.interface";

const router: Router = Router();

/* Get all products */
router.get("/products", async (req: Request, res: Response) => {
  const products = await getProducts();
  if (!products.length) {
    res.status(404).json({ error: "No products found" });
    return;
  }
  res.status(200).json({ totalProducts: products.length, products });
});

/* Get a single product by ID */
router.get("/products/:id", async (req: Request, res: Response) => {
  const product = await findOne(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.status(200).json(product);
});

/* Add a new product */
router.post("/products", async (req: Request, res: Response) => {
  const { name, price, quantity, image } = req.body;

  if (!name || price === undefined || quantity === undefined || !image) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const newProduct = await addProduct({ name, price, quantity, image });

  if (!newProduct) {
    res.status(500).json({ error: "Failed to add product" });
    return;
  }

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct, // Return full product details
  });
});

/* Update a product */
router.put("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, quantity, image } = req.body;

  if (!name || price === undefined || quantity === undefined || !image) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const existingProduct = await findOne(id);
  if (!existingProduct) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const updatedProduct = await updateProduct(id, { name, price, quantity, image });

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct, // Return updated product
  });
});

/* Delete a product */
router.delete("/products/:id", async (req: Request, res: Response) => {
  const existingProduct = await findOne(req.params.id);
  if (!existingProduct) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  await removeProduct(req.params.id);
  res.status(200).json({ message: "Product deleted successfully" });
});

export default router;
