const express = require("express");
const router = express.Router();

const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];
// 장바구니에 추가
const Cart = require("../schemas/carts.js");
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 장바구니에 들어있습니다" });
  }
  await Cart.create({ goodsId, quantity });
  res.json({ result: "success" });
});

//장바구니 목록 변경
router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.updateOne(
      //굿즈 아이디에 해당하는 값이 있으면
      { goodsId: goodsId },
      // 콘티티에 맞는 값으로 수정해주라
      { $set: { quantity: quantity } }
    );
  }
  //장바구니에 해당하는 값이 없더라도 에러가 발생하지 않도록 설계
  res.status(200).json({ success: true });
});

//장바구니 목록 삭제하기
router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
  }
  res.status(200).json({ result: "success" });
});

// 상품 목록 조회 API
router.get("/goods", (req, res) => {
  //어떤 상태코드로 반환한건지 확인 :status
  res.status(200).json({
    goods, //키와 벨류 값이 같을땐 하나만 넣어줘도 됌
  });
});

// 상품 상세 조회 API
router.get("/goods/:goodsId", (req, res) => {
  const { goodsId } = req.params;

  const [result] = goods.filter((good) => Number(goodsId) === good.goodsId);
  res.status(200).json({ detail: result });
});

const Goods = require("../schemas/goods.js");
// 프론트에서 입력되는 값을 데이터베이스로 넘겨 저장해주기
router.post("/goods/", async (req, res) => {
  //입력받기
  const { goodsId, name, thumbnailUrl, category, price } = req.body;
  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 존재하는 GoodId입니다" });
  }
  const createGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });
  res.json({ goods: createGoods });
});

module.exports = router;
