import { Router } from "express";
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";
const manager = new CartManager();
const productManager = new ProductManager();
const cartsRouter = Router();

// Obtener carrito por id
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await manager.getCart();
    const cartById = cart.find((cart) => cart.id == cid);

    if (!cartById) {
      res.status(404).send({ error: true, message: "Carrito no encontrado" });
    }
    res.send(cartById);
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Crear carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await manager.addCart();
    res.send(cart);
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Crear carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await manager.getCart();
    const products = await productManager.getProducts();
    const cartById = cart.find((cart) => cart.id == cid);
    const productById = products.find((product) => product.id == pid);

    if (!cartById) {
      res.status(404).send({ error: true, message: "Carrito no encontrado" });
    }

    if (!productById) {
      res.status(404).send({ error: true, message: "Producto no encontrado" });
    }

    await manager.addProductCart(cid, pid);
    res.send({ created: true });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

export default cartsRouter;
