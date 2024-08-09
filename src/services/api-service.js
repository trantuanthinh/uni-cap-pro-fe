import httpService from "./http-service";

class APIService {
    // Use environment variables or configuration files to manage the root API URL
    #rootAPI = "http://localhost:5130/api";
    // Alternatively, you can use process.env for different environments
    // rootAPI = `${process.env.API_URL || 'http://localhost:5130/api'}`;

    // Utility method to build full URL

    #buildUrl(path, id = null) {
        return id ? `${this.#rootAPI}/${path}/${id}` : `${this.#rootAPI}/${path}`;
    }

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
        console.error(`${context} ${error.message}`);
        throw error;
    }

    // User
    async getUsers() {
        return this.#getItems("users");
    }

    async getUser(id) {
        return this.#getItem("user", id);
    }

    async postUser(data) {
        return this.#postItem("user", data);
    }

    async patchUser(id, data) {
        return this.#patchItem("user", id, data);
    }

    async deleteUser(id) {
        return this.#deleteItem("user", id);
    }
}

const apiService = new APIService();
Object.freeze(apiService);

export default apiService;
