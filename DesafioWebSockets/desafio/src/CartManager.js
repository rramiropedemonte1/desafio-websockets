import fs from "fs/promises";

export default class CartManager {
  constructor() {
    this.path = "./src/db/carrito.json";
    this.cart = [];
  }

  async #saveCart(cart) {
    await fs.writeFile(this.path, JSON.stringify(cart));
    this.cart = cart;
    return cart;
  }

  getCart = async () => {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const cart = JSON.parse(data);
      return cart;
    } catch (e) {
      await this.#saveCart([]);
    }
  };

  addCart = async () => {
    try {
      const cart = await this.getCart();
      const newCart = {
        id: cart.length == 0 ? 1 : cart[cart.length - 1].id + 1,
        products: [],
      };
      this.cart = cart;
      cart.push(newCart);
      await this.#saveCart(cart);
      return newCart;
    } catch (e) {
      console.log(e);
    }
  };

  addProductCart = async (cartId, productId) => {
    try {
      const cart = await this.getCart();
      const cartIndex = cart.findIndex((cart) => cart.id == cartId);
      const cartProducts = cart[cartIndex].products;
      const isProductFound = cartProducts.some(
        (cartItems) => cartItems.product === productId
      );
      if (cartIndex == -1) return false;

      if (isProductFound) {
        const existingProduct = cartProducts.find(
          (cartItem) => cartItem.product === productId
        );
        if (existingProduct) {
          existingProduct.quantity += 1;
          await this.#saveCart(cart);
        }
      } else {
        const cartProduct = {
          product: productId,
          quantity: 1,
        };
        cartProducts.push(cartProduct);
        await this.#saveCart(cart);
        return cartProduct;
      }
    } catch (e) {
      console.log(e);
    }
  };
}
