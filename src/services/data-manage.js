class DataManagement {
    USER_TYPE = {
        COMPANY: "COMPANY",
        PRODUCER: "PRODUCER",
    };

    ACTIVE_STATUS = {
        ACTUVE: "ACTIVE",
        INACTIVE: "INACTIVE",
    };
}

Object.freeze(DataManagement.prototype);

const dataManagement = new DataManagement();
Object.freeze(dataManagement);

export default dataManagement;
