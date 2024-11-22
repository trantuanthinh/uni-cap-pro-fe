export class CartType {
    static cart = "cart";
    static shared_cart = "shared_cart";
}

export class OrderType {
    static individual = "individual";
    static shared_order = "shared_order";
    static join_group = "join_group";
}

export class QuantityRange {
    static min = 1;
    static max = 999;
}

export class DeliveryStatus {
    static pending = "PENDING";
    static processing = "PROCESSING";
    static delivering = "DELIVERING";
    static delivered = "DELIVERED";
    static cancelled = "CANCELLED";
}