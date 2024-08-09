export class SharedService {
    formatVietnamDong(number) {
        return this.isNumber(number) ? `${this.formatMoney(number)}vnd` : "";
    }

    formatMoney(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    isNumber(number) {
        return typeof number === "number" || !isNaN(number);
    }

    isVietnamesePhoneNumber(number) {
        const regex = /^0(3[2-9]|5[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}$/;
        return regex.test(number);
    }
}

Object.freeze(SharedService);
const sharedService = new SharedService();

export default sharedService;
