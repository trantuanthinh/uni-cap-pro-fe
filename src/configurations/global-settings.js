class GlobalSettings {
    static Settings = {
        apiUrl: "http://localhost:5130/api",
        debounceTimer: {
            valueChanges: 500,
        },
        Version: "1.0.0",
    };
}

Object.freeze(GlobalSettings);
export default GlobalSettings;