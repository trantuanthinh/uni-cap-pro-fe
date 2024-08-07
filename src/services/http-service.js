class HTTPService {
    async getItems(url) {
        try {
            const request = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url, request);
            console.log("Get Items Successfully", response);
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    async getItem(url) {
        try {
            const request = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url, request);
            console.log("Get Item Successfully", response);
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    async postItem(url, data) {
        try {
            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };
            const response = await fetch(url, request);
            console.log("Created Successfully", response);
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async patchItem(url, data) {
        try {
            const request = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };
            const response = await fetch(url, request);
            console.log("Patched Successfully", response);
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async deleteItem(url) {
        try {
            const request = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url, request);
            console.log("Deleted Successfully", response);
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}

Object.freeze(HTTPService);
const httpService = new HTTPService();

export default httpService;
