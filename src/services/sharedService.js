import moment from "moment";

class SharedService {
    #formatDateTimeString = "DD/MM/YYYY HH:mm";
    #formatDateString = "DD/MM/YYYY";
    #formatTimeString = "HH:mm";

    isString(value) {
        return typeof value === "string" || value instanceof String;
    }

    isNumber(value) {
        return typeof value === "number" || !isNaN(Number(value));
    }

    isNullOrEmpty(data) {
        return (
            data === null ||
            data === "" ||
            data === undefined ||
            (typeof data === "object" && Object.keys(data).length === 0)
        );
    }

    formatVietnamDong(number) {
        if (!this.isNumber(number)) {
            return "";
        }

        return Number(number).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    }

    isVietnamesePhoneNumber(number) {
        if (typeof number !== "string") {
            return false;
        }

        const regex = /^0(3[2-9]|5[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}$/;
        return regex.test(number);
    }
    /**
     * Converts a date to a string in the format 'DD/MM/YYYY HH:mm'.
     * @param {string | Date} data - The date to convert.
     * @returns {string} - The formatted date string.
     */
    formatToDateTime(data) {
        if (!this.isNullOrEmpty(data)) {
            return moment(data).format(this.#formatDateTimeString);
        }
        return "";
    }

    /**
     * Converts a date to a string in the format 'DD/MM/YYYY'.
     * @param {string | Date} data - The date to convert.
     * @returns {string} - The formatted date string.
     */
    formatToDate(data) {
        if (!this.isNullOrEmpty(data)) {
            return moment(data).format(this.#formatDateString);
        }
        return "";
    }

    /**
     * Converts a date to a string in the format 'HH:mm'.
     * @param {string | Date} data - The date to convert.
     * @returns {string} - The formatted time string.
     */
    formatToTime(data) {
        if (!this.isNullOrEmpty(data)) {
            return moment(data, "HH:mm:ss.SSSSSSS").format(this.#formatTimeString);
        }
        return "";
    }

    /**
     * Checks if the current date is before the given date.
     * @param {string | Date} compareDate - The date to compare against.
     * @returns {boolean} - True if current date is before the compare date.
     */
    isBeforeDate(compareDate) {
        if (this.isNullOrEmpty(compareDate)) return false;
        return moment().isBefore(moment(compareDate));
    }

    /**
     * Checks if the current date is after the given date.
     * @param {string | Date} compareDate - The date to compare against.
     * @returns {boolean} - True if current date is after the compare date.
     */
    isAfterDate(compareDate) {
        if (this.isNullOrEmpty(compareDate)) return false;
        return moment().isAfter(moment(compareDate));
    }

    /**
     * Checks if one date is before another date.
     * @param {string | Date} currentDate - The first date.
     * @param {string | Date} compareDate - The date to compare against.
     * @returns {boolean} - True if currentDate is before compareDate.
     */
    isBefore(currentDate, compareDate) {
        if (this.isNullOrEmpty(currentDate) || this.isNullOrEmpty(compareDate)) return false;
        return moment(currentDate).isBefore(moment(compareDate));
    }

    /**
     * Checks if one date is after another date.
     * @param {string | Date} currentDate - The first date.
     * @param {string | Date} compareDate - The date to compare against.
     * @returns {boolean} - True if currentDate is after compareDate.
     */
    isAfter(currentDate, compareDate) {
        if (this.isNullOrEmpty(currentDate) || this.isNullOrEmpty(compareDate)) return false;
        return moment(currentDate).isAfter(moment(compareDate));
    }
}

const sharedService = new SharedService();
Object.freeze(sharedService);

export default sharedService;
