import { Router } from "express";
import ProductManager from "../ProductManager.js";
const manager = new ProductManager();
const productsView = Router();

// Obtener todos los productos
productsView.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render("home", { products: products });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

export default productsView;
