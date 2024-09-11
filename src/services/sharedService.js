import moment from "moment";

export class SharedService {
    #formatDateTimeString = "DD/MM/YYYY HH:mm";
    #formatDateString = "DD/MM/YYYY";
    #formatTimeString = "HH:mm";

    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    isNumber(value) {
        return typeof value === "number" && !isNaN(Number(value));
    }

    isNullOrEmpty(data) {
        return data === null || data === "" || data === undefined;
    }

    formatVietnamDong(number) {
        if (!this.isNumber(number)) {
            return "";
        }

        return Number(number).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    }

    isVietnamesePhoneNumber(number) {
        if (typeof number !== "string") {
            return false;
        }

        const regex = /^0(3[2-9]|5[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}$/;
        return regex.test(number);
    }

    formatDate(data) {
        if (!this.isNullOrEmpty(data)) {
            return moment(data).format(this.#formatDateString);
        }
        return "";
    }

    formatDateTime(data) {
        if (!this.isNullOrEmpty(data)) {
            return moment(data).format(this.#formatDateTimeString);
        }
        return "";
    }
}

const sharedService = new SharedService();
Object.freeze(sharedService);

export default sharedService;
