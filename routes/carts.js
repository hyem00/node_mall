const express = require("express");
const router = express.Router();
const Cart = require("../schemas/carts");
const Goods = require("../schemas/goods");

router.get("/carts", async (req, res) => {
  // 카트안에 있는 모든걸 다 여기에 할당 (goods id , qu 뭐시기)
  const carts = await Cart.find({});
  const goodsIds = carts.map((cart) => {
    return cart.goodsId;
  });
  // Goods 안에 모든 정보를 가져올건데 만약 goodsId 변수 안에 존재하는 값일때만 조회해라
  const goods = await Goods.find({ goodsId: goodsIds });

  const results = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => {
        item.goodsId === cart.goodsId;
      }),
    };
  });
  res.json({
    carts: results,
  });
});

module.exports = router;
