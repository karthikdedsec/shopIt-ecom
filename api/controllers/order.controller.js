import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

//create new order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

//get order details  => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user");

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  res.status(200).json({
    order,
  });
});

//get current user orders  => /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No orders found!", 404));
  }

  res.status(200).json({
    order,
  });
});

//get all orders - admin  => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();

  if (!order) {
    return next(new ErrorHandler("No orders found!", 404));
  }

  res.status(200).json({
    order,
  });
});

//update orders - admin  => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No orders found with this id!", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("Already delivered this order", 400));
  }

  //update product stock
  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());

    if (!product) {
      return next(new ErrorHandler("No product found with this id!", 404));
    }

    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});

//delet orders - admin  => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No orders found!", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order Deleted",
  });
});
