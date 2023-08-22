import express from "express";
import handlebars from "express-handlebars";
import { Server as HTTPServer } from "http";
import { Server as SocketIO } from "socket.io";
import ProductManager from "./ProductManager.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import __dirname from "./dirname.js";
import productsView from "./routes/products.views.js";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const httpServer = HTTPServer(app);
export const io = new SocketIO(httpServer);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/products", productsView);

// Productos en tiempo real
app.get("/realtimeproducts", async (req, res) => {
  try {
    const io = req.io;
    const listaActualizada = await manager.getProducts();
    res.render("realTimeProducts");
    io.emit("listProducts", listaActualizada);
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

app.post("/realtimeproducts", async (req, res) => {
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
      await manager.addProduct(body);
      const listaActualizada = await manager.getProducts();
      res.render("realTimeProducts");
      io.emit("listProducts", listaActualizada);
    } catch (e) {
      res.status(502).send({ error: true, msg: e });
    }
  }
});

const manager = new ProductManager();

// * Metodos socket
io.on("connection", async (socket) => {
  const productList = await manager.getProducts();
  socket.emit("listProducts", productList);
});

httpServer.listen(8080, () => {
  console.log("escuchando en el puerto 8080!");
});
