class GlobalSettings {
    static Settings = {
        name: "Aladin",
        apiUrl: "http://localhost:5130/api",
        debounceTimer: {
            valueChanges: 500,
        },
        version: "1.0.0",
    };
}

Object.freeze(GlobalSettings);
export default GlobalSettings;