import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      requied: [true, "Provide OrderId"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    product_details: {
      name: String,
      image: Array,
    },
    paymentId: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    order_status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: function() {
        // Set default status based on payment method
        return this.payment_status === 'PAID' ? 'PROCESSING' : 'PENDING';
      }
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;