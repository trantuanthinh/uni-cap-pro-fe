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

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Get Items Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to get items:", error);
            throw error;
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

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Get Item Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to get item:", error);
            throw error;
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

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Post Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to post item:", error);
            throw error;
        }
    }

    async putImage(url, formData) {
        try {
            const request = {
                method: "PUT",
                body: formData,
            };

            const response = await fetch(url, request);

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Post Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to post item:", error);
            throw error;
        }
    }

    async putItem(url, data) {
        try {
            const request = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };

            const response = await fetch(url, request);

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Put Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to post item:", error);
            throw error;
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

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Patch Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to patch item:", error);
            throw error;
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

            if (!response.ok) {
                throw new Error(`Error ${ response.status }: ${ response.statusText }`);
            }

            console.log("Delete Successfully", response);
            return await response.json();
        } catch (error) {
            console.error("Failed to delete item:", error);
            throw error;
        }
    }
}

const httpService = new HTTPService();
Object.freeze(httpService);

export default httpService;
