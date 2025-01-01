import { toast } from "sonner";

/**
 * A service for handling HTTP requests.
 */
class HTTPService {
    /**
     * Fetches multiple items from a given URL using a GET request.
     * @param {string} url - The URL to send the GET request to.
     * @returns {Promise<Object>} - The response data as JSON.
     */
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
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Get items:", error);
            toast.error("Failed to Get items:", error);
        }
    }

    /**
     * Fetches a single item from a given URL using a GET request.
     * @param {string} url - The URL to send the GET request to.
     * @returns {Promise<Object>} - The response data as JSON.
     */
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
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Get item:", error);
            toast.error("Failed to Get item:", error);
        }
    }

    /**
     * Sends a POST request to a given URL with provided data.
     * @param {string} url - The URL to send the POST request to.
     * @param {Object} data - The data to be sent in the request body.
     * @returns {Promise<Object>} - The response data as JSON.
     */
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
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Post item:", error);
            toast.error("Failed to Post item:", error);
        }
    }

    /**
     * Sends a PUT request to upload an image using FormData.
     * @param {string} url - The URL to send the PUT request to.
     * @param {FormData} formData - The FormData containing the image.
     * @returns {Promise<Object>} - The response data as JSON.
     */
    async putImage(url, formData) {
        try {
            const request = {
                method: "PUT",
                body: formData,
            };

            const response = await fetch(url, request);

            if (!response.ok) {
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Put image:", error);
            toast.error("Failed to Put image:", error);
        }
    }

    /**
     * Sends a PUT request to a given URL with provided data.
     * @param {string} url - The URL to send the PUT request to.
     * @param {Object} data - The data to be sent in the request body.
     * @returns {Promise<Object>} - The response data as JSON.
     */
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
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Put item:", error);
            toast.error("Failed to Put item:", error);
        }
    }

    /**
     * Sends a PATCH request to a given URL with provided data.
     * @param {string} url - The URL to send the PATCH request to.
     * @param {Object} data - The data to be sent in the request body.
     * @returns {Promise<Object>} - The response data as JSON.
     */
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
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Patch item:", error);
            toast.error("Failed to Patch item:", error);
        }
    }

    /**
     * Sends a DELETE request to a given URL.
     * @param {string} url - The URL to send the DELETE request to.
     * @returns {Promise<Object>} - The response data as JSON.
     */
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
                toast.error(`Error ${ response.status }: ${ response.statusText }`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to Delete item:", error);
            toast.error("Failed to Delete item:", error);
        }
    }
}

const httpService = new HTTPService();
Object.freeze(httpService);

export default httpService;