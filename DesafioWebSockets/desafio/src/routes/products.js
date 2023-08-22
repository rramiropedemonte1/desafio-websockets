import { Router } from "express";
import ProductManager from "../ProductManager.js";
const manager = new ProductManager();
const productsRouter = Router();

// Obtener todos los productos
productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await manager.getProducts();
    const productsLimit = products.slice(0, limit);

    res.send(limit ? productsLimit : products);
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Obtener producto por id
productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await manager.getProducts();
    const productsById = products.find((producto) => producto.id == pid);

    if (!productsById) {
      res.status(404).send({ error: true, message: "Producto no encontrado" });
    }
    res.send(productsById);
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Actualizar producto por id
productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = req.body;
    await manager.updateProduct(pid, product);
    res.send({ update: true });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Crear producto
productsRouter.post("/", async (req, res) => {
  const body = req.body;
  if (
    !body.title ||
    !body.description ||
    !body.code ||
    !body.price ||
    !body.status ||
    !body.stock ||
    !body.category
  ) {
    res.send({ error: true, message: "Hay algunos campos en blanco" });
  } else {
    try {
      const result = await manager.addProduct(body);
      res.send(result);
    } catch (e) {
      res.status(502).send({ error: true, msg: e });
    }
  }
});

// Borrar producto
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await manager.getProducts();
    const productsById = products.find((producto) => producto.id == pid);

    if (!productsById) {
      res.status(404).send({ error: true, message: "Producto no encontrado" });
    }
    await manager.deleteProduct(pid);
    res.send({ deleted: true });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Borrar todos los productos
productsRouter.delete("/", async (req, res) => {
  await manager.deleteAll();
  res.send({ deleted: true });
});

export default productsRouter;
