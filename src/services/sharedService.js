export class SharedService {
    formatVietnamDong(number) {
        return this.isNumber(number) ? `${this.formatMoney(number)}đ` : "";
    }

    formatMoney(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    isNumber(number) {
        return typeof number === "number" || !isNaN(number);
    }
}

Object.freeze(SharedService);
const sharedService = new SharedService();

export default sharedService;
