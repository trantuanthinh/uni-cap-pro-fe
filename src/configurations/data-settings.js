export class ACTIVE_STATUS {
    static ACTIVE = "ACTIVE";
    static INACTIVE = "INACTIVE";
}

export class CartType {
    static cart = "cart";
    static shared_cart = "shared_cart";
}

export class DeliveryStatus {
    static cancelled = "CANCELLED";
    static delivering = "DELIVERING";
    static delivered = "DELIVERED";
    static pending = "PENDING";
    static processing = "PROCESSING";
}

export class OrderType {
    static individual = "individual";
    static join_group = "join_group";
    static shared_order = "shared_order";
}

export class QuantityRange {
    static max = 999;
    static min = 1;
}

export class USER_TYPE {
    static BUYER = "BUYER";
    static SALER = "SALER";
}
