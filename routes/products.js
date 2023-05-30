const express = require("express");
const {
  saveProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  buyProductByUser,
} = require("../database/products");
const auth = require("../middleware/auth");
const router = express.Router();
const z = require("zod");

const productSchema = z.object({
  name: z.string(),
  price: z.number().min(0),
});

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

router.get("/products", auth, async (req, res) => {
  const moreThan = req.query.more_than ? Number(req.query.more_than) : 0;
  const products = await getAllProducts(moreThan);
  res.json({
    products,
  });
});

router.get("/products/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const product = await getProductById(id);
  res.json({
    product,
  });
});

router.post("/products", auth, async (req, res, next) => {
  try {
    const newProduct = productSchema.parse(req.body);
    const savedProduct = await saveProduct(newProduct);
    res.json({
      product: savedProduct,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/products/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const product = productSchema.parse(req.body);
  const updatedProduct = await updateProduct(id, product);
  res.json({
    product: updatedProduct,
  });
});

router.delete("/products/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  await deleteProduct(id);
  res.status(204).send();
});

router.post("/products/buy", auth, async (req, res) => {
  const user = req.user;
  const productsAndQuantity = req.body.products;
  for (let item of productsAndQuantity) {
    await buyProductByUser(user.userId, item.id, item.quantity);
  }
  res.status(201).json({
    success: true,
  });
});

module.exports = {
  router,
};
