import httpService from "./http-service";

class APIService {
    // Use environment variables or configuration files to manage the root API URL
    #rootAPI = "http://localhost:5130/api";
    // Alternatively, you can use process.env for different environments
    // rootAPI = `${process.env.API_URL || 'http://localhost:5130/api'}`;

    #buildUrl(path, id = null) {
        return id ? `${ this.#rootAPI }/${ path }/${ id }` : `${ this.#rootAPI }/${ path }`;
    }

    //#region core 
    async #getItems(url) {
        const fullUrl = this.#buildUrl(url);
        try {
            return await httpService.getItems(fullUrl);
        } catch (error) {
            return this.#handleError("getItems: ", error);
        }
    }

    async #getItem(url, id) {
        const fullUrl = this.#buildUrl(url, id);
        try {
            return await httpService.getItem(fullUrl);
        } catch (error) {
            return this.#handleError("getItem: ", error);
        }
    }

    async #postItem(url, data) {
        const fullUrl = this.#buildUrl(url);
        try {
            return await httpService.postItem(fullUrl, data);
        } catch (error) {
            return this.#handleError("postItem: ", error);
        }
    }

    async #patchItem(url, id, data) {
        const fullUrl = this.#buildUrl(url, id);
        try {
            return await httpService.patchItem(fullUrl, data);
        } catch (error) {
            return this.#handleError("patchItem: ", error);
        }
    }

    async #deleteItem(url, id) {
        const fullUrl = this.#buildUrl(url, id);
        try {
            return await httpService.deleteItem(fullUrl);
        } catch (error) {
            return this.#handleError("deleteItem: ", error);
        }
    }

    #handleError(context, error) {
        console.error(`${ context } ${ error.message }`);
        throw error;
    }


    //#region auth
    async signin(data) {
        return this.#postItem("auth/signin", data);
    }

    async signup(data) {
        return this.#postItem("auth/signup", data);
    }

    //#region users
    async getUsers() {
        return this.#getItems("users");
    }

    async getUser(id) {
        return this.#getItem("users", id);
    }

    async patchUser(id, data) {
        return this.#patchItem("users", id, data);
    }

    async deleteUser(id) {
        return this.#deleteItem("users", id);
    }

    //#region products
    async getProducts() {
        return this.#getItems("products");
    }

    async getProduct(id) {
        return this.#getItem("products", id);
    }

    //#region orders
    async getOrders() {
        return this.#getItems("orders");
    }

    async getOrder(id) {
        return this.#getItem("orders", id);
    }

    async postOrder(data) {
        return this.#postItem("orders", data);
    }

    async postBuyTogetherOrder(orderId, data) {
        return this.#postItem(`orders/buy-together/${ orderId }`, data);
    }

    //#region discounts
    async getDiscounts() {
        return this.#getItems("discounts");
    }

    async getDiscounts(id) {
        return this.#getItem("discounts", id);
    }
}

const apiService = new APIService();
Object.freeze(apiService);

export default apiService;
