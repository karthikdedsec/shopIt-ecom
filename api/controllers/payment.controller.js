import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import Stripe from "stripe";
import Order from "../models/order.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//create stripe checkout session => /api/v1/payment/checkout_session

export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;

    // console.log(body);

    const lineItems = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: ["txr_1OrFzESJuK4yWHAvlEAKyhdV"],
        quantity: item?.quantity,
      };
    });

    const shippingInfo = body?.shippingInfo;

    const shippingRate =
      body?.itemsPrice >= 200
        ? "shr_1OrFpbSJuK4yWHAvliYGapgq"
        : "shr_1OrFq9SJuK4yWHAv8UrO5IuQ";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
      shipping_options: [
        {
          shipping_rate: shippingRate,
        },
      ],
      line_items: lineItems,
    });

    // console.log(session);

    res.status(200).json({
      url: session.url,
    });
  }
);

const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      console.log("item", item);
      console.log("product", product);

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });
      if (cartItems.length === line_items.data.length) {
        resolve(cartItems);
      }
    });
  });
};

//create new order after payment => /api/v1/payment/webhook
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await getOrderItems(line_items);

      const user = session.client_reference_id;

      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };

      console.log(orderData);

      await Order.create(orderData);

      res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.log("Error =>", error);
  }
});
