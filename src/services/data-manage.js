class DataManagement {
    USER_TYPE = {
        BUYER: "BUYER",
        SALER: "SALER",
    };

    ACTIVE_STATUS = {
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
    };
}

Object.freeze(DataManagement.prototype);

const dataManagement = new DataManagement();
Object.freeze(dataManagement);

export default dataManagement;
