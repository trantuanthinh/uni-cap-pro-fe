// const API_URL = `http://${environment.API_DOMAIN}:${environment.API_PORT}/api`;
import httpService from "./http-service";

class APIService {
    rootApI = "http://localhost:5043/api";

    async getItems(url) {
        let items = await httpService.getItems(url);
        return items;
    }

    async getItem(url, id) {
        if (id) {
            url = url + "/" + id;
        }
        let item = await httpService.getItem(url);
        return item;
    }

    async postItem(url, data) {
        let item = await httpService.postItem(url, data);
        return item;
    }

    async patchItem(url, id, data) {
        if (id) {
            url = url + "/" + id;
        }
        let item = await httpService.patchItem(url, data);
        return item;
    }

    async deleteItem(url, id) {
        if (id) {
            url = url + "/" + id;
        }
        let item = await httpService.deleteItem(url);
        return item;
    }

    // User
    async getUsers() {
        // let baseUrl = this.rootApI + "/User";
        let baseUrl = "http://jsonplaceholder.typicode.com/users";
        try {
            return await this.getItems(baseUrl);
        } catch (error) {
            return this.handleError("getUsers: ", error);
        }
    }

    async getUsers(id) {
        // let baseUrl = this.rootApI + "/User";
        let baseUrl = "http://jsonplaceholder.typicode.com/users";
        try {
            return await this.getItem(baseUrl, id);
        } catch (error) {
            return this.handleError("getUsers: ", error);
        }
    }

    async postUser(data) {
        let baseUrl = this.rootApI + "/User";
        try {
            return await this.postItem(baseUrl, data);
        } catch (error) {
            return this.handleError("getUsers: ", error);
        }
    }

    async patchUser(id, data) {
        let baseUrl = this.rootApI + "/User";
        try {
            return await this.patchItem(baseUrl, id, data);
        } catch (error) {
            return this.handleError("getUsers: ", error);
        }
    }
}

Object.freeze(APIService);
const apiService = new APIService();

export default apiService;