import fs from "fs/promises";

export default class ProductManager {
  constructor() {
    this.path = "./src/db/products.json";
    this.products = [];
  }

  async #saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products));
    this.products = products;
    return products;
  }

  getProducts = async () => {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (e) {
      await this.#saveProducts([]);
    }
  };

  addProduct = async (product) => {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = product;

    try {
      const products = await this.getProducts();

      const product = {
        id: products.length == 0 ? 1 : products[products.length - 1].id + 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };

      const codeIsFound = this.products.some(
        (product) => product.code === code
      );
      if (codeIsFound) {
        console.log("Este codigo ya existe:", code);

        return;
      }

      this.products = products;
      products.push(product);
      await this.#saveProducts(products);
      return product;
    } catch (e) {
      console.log(e);
    }
  };

  getProductById = async (id) => {
    const products = await this.getProducts();
    const productoById = products.find((producto) => producto.id == id);

    if (!productoById) {
      return console.log("Not found");
    } else {
      return productoById;
    }
  };

  updateProduct = async (id, product) => {
    const products = await this.getProducts();
    const productIndex = products.findIndex((producto) => producto.id == id);
    if (productIndex == -1) return false;

    products[productIndex] = { ...products[productIndex], ...product };
    await this.#saveProducts(products);
  };

  deleteProduct = async (pid) => {
    const products = await this.getProducts();

    let idIsFound = products.find((product) => product.id === pid);
    if (!idIsFound) {
      return `No se ha encontrado ese producto con id ${pid}`;
    }

    const removeById = products.filter((item) => item.id !== pid);
    await this.#saveProducts(removeById);
  };

  deleteAll = async () => {
    await this.#saveProducts([]);
  };
}
