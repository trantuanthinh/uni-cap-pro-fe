export class SharedService {
    formatVietnamDong(number) {
        return this.isNumber(number) ? `${this.formatMoney(number)}` : "";
    }

    formatMoney(num) {
        if (typeof num !== "number" && typeof num !== "string") {
            return "";
        }

        return Number(num).toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }

    isNumber(value) {
        return typeof value === "number" || !isNaN(Number(value));
    }

    isVietnamesePhoneNumber(number) {
        if (typeof number !== "string") {
            return false;
        }

        const regex = /^0(3[2-9]|5[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}$/;
        return regex.test(number);
    }
}

const sharedService = new SharedService();
Object.freeze(sharedService);

export default sharedService;
