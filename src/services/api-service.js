import httpService from "./http-service";

class APIService {
    // Use environment variables or configuration files to manage the root API URL
    #rootAPI = "http://localhost:5130/api";
    // Alternatively, you can use process.env for different environments
    // rootAPI = `${process.env.API_URL || 'http://localhost:5130/api'}`;

    #buildUrl(path, id, option) {
        let fullUrl = `${ this.#rootAPI }/${ path }`;
        if (id) {
            fullUrl += `/${ id }`;
        }

        if (option) {
            let queryParams = [];

            for (let key in option) {
                queryParams.push(`${ key }=${ encodeURIComponent(option[key]) }`);
            }

            fullUrl += `?${ queryParams.join("&") }`;
        }
        return fullUrl;
    }

    //#region core
    async #getItems(url, option) {
        let fullUrl = this.#buildUrl(url, null, option);
        try {
            return await httpService.getItems(fullUrl);
        } catch (error) {
            return this.#handleError("getItems: ", error);
        }
    }

    async #getItem(url, id, option = null) {
        let fullUrl = this.#buildUrl(url, id, option);
        try {
            return await httpService.getItem(fullUrl);
        } catch (error) {
            return this.#handleError("getItem: ", error);
        }
    }

    async #postItem(url, data, option = null) {
        let fullUrl = this.#buildUrl(url, option);
        try {
            return await httpService.postItem(fullUrl, data);
        } catch (error) {
            return this.#handleError("postItem: ", error);
        }
    }

    async #putImage(url, id, formData) {
        let fullUrl = this.#buildUrl(url, id);
        try {
            return await httpService.putImage(fullUrl, formData);
        } catch (error) {
            return this.#handleError("postItem: ", error);
        }
    }

    async #putItem(url, data, option = null) {
        let fullUrl = this.#buildUrl(url, option);
        try {
            return await httpService.putItem(fullUrl, data);
        } catch (error) {
            return this.#handleError("putItem: ", error);
        }
    }

    async #patchItem(url, id, data, option = null) {
        let fullUrl = this.#buildUrl(url, id, option);
        try {
            return await httpService.patchItem(fullUrl, data);
        } catch (error) {
            return this.#handleError("patchItem: ", error);
        }
    }

    async #deleteItem(url, id, option = null) {
        let fullUrl = this.#buildUrl(url, id, option);
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
    //#endregion

    //#region setting-data
    async getProvinces(option) {
        return this.#getItems("address/provinces", option);
    }

    async getDistricts(id, option) {
        return this.#getItems(`address/districts/${ id }`, option);
    }

    async getWards(id, option) {
        return this.#getItems(`address/wards/${ id }`, option);
    }
    //#endregion

    async sendContact(data) {
        return this.#postItem("send-contact", data);
    }

    //#region auth
    async signin(data) {
        return this.#postItem("auth/signin", data);
    }

    async signup(data) {
        return this.#postItem("auth/signup", data);
    }

    async sendOTP(data) {
        return this.#postItem("auth/send-otp", data);
    }

    async resetPassword(data) {
        return this.#postItem("auth/reset-password", data);
    }
    //#endregion

    //#region users
    async getUsers(option) {
        return this.#getItems("users", option);
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

    async getUserOrders(id, option) {
        return this.#getItems(`users/orders/${ id }`, option);
    }

    async changePassword(id, data) {
        return this.#postItem(`users/change-password/${ id }`, data);
    }

    async uploadAvatar(file, id) {
        const formData = new FormData();
        formData.append("file", file);
        return this.#putImage(`users/avatar`, id, formData);
    }

    async deleteAvatar(id) {
        return this.#deleteItem(`users/avatar`, id);
    }
    //#endregion

    //#region products
    async getProducts(option) {
        return this.#getItems("products", option);
    }

    async getProductsByStoreId(id, option) {
        return this.#getItems(`products/store/${ id }`, option);
    }

    async getProduct(id) {
        return this.#getItem("products", id);
    }

    async postProduct(data) {
        return this.#postItem("products", data);
    }

    async patchProduct(id, data) {
        return this.#patchItem("products", id, data);
    }

    async deleteProduct(id) {
        return this.#deleteItem("products", id);
    }
    //#endregion

    //#region product_main_categories
    async getProd_Main_Categories(option) {
        return this.#getItems("product_main_categories", option);
    }

    async getProd_Main_Category(id) {
        return this.#getItem("product_main_categories", id);
    }

    async postProd_Main_Category(data) {
        return this.#postItem("product_main_categories", data);
    }

    async patchProd_Main_Category(id, data) {
        return this.#patchItem("product_main_categories", id, data);
    }

    async deleteProd_Main_Category(id) {
        return this.#deleteItem("product_main_categories", id);
    }
    //#endregion

    //#region product_categories
    async getProd_Categories(option) {
        return this.#getItems("product_categories", option);
    }

    async getProd_Category(id) {
        return this.#getItem("product_categories", id);
    }

    async postProd_Category(data) {
        return this.#postItem("product_categories", data);
    }

    async patchProd_Category(id, data) {
        return this.#patchItem("product_categories", id, data);
    }

    async deleteProd_Category(id) {
        return this.#deleteItem("product_categories", id);
    }
    //#endregion

    //#region orders
    async getOrders(option) {
        return this.#getItems("orders", option);
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
    //#endregion

    //#region discounts
    async getDiscounts(option) {
        return this.#getItems("discounts", option);
    }

    async getDiscounts(id) {
        return this.#getItem("discounts", id);
    }
    //#endregion

    //#region feedbacks
    async getFeedbacksByProductId(productId) {
        return this.#getItems(`feedbacks/product/${ productId }`);
    }

    async postFeedbackByProductId(data) {
        return this.#postItem(`feedbacks/product`, data);
    }
    //#endregion
}

const apiService = new APIService();
Object.freeze(apiService);

export default apiService;
