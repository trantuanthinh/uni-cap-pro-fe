import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

const VietnamMap = () => {
    const vietnamGeoUrl =
        "https://gist.githubusercontent.com/tandat2209/5eb797fc2bcc1c8b6d71271353a40ab4/raw/ca883f00b7843afeb7b6ad73ec4370ab514a8a90/gadm36_VNM_0.json";

    const paracelIslandsGeoUrl =
        "https://gist.githubusercontent.com/tandat2209/5eb797fc2bcc1c8b6d71271353a40ab4/raw/ca883f00b7843afeb7b6ad73ec4370ab514a8a90/gadm36_XPI_0.json";

    const spralyIslandsGeoUrl =
        "https://gist.githubusercontent.com/tandat2209/5eb797fc2bcc1c8b6d71271353a40ab4/raw/ca883f00b7843afeb7b6ad73ec4370ab514a8a90/gadm36_XSP_0.json";
    const vietnam = [vietnamGeoUrl, paracelIslandsGeoUrl, spralyIslandsGeoUrl];
    return (
        <div>
            <ComposableMap
                data-tip=""
                projection="geoMercator"
                projectionConfig={{
                    scale: 1000,
                    center: [105, 15]
                }}
                style={{
                    width: "100%",
                    height: "auto"
                }}
            >
                <ZoomableGroup>
                    {vietnam.map((geoUrl) => (
                        <Geographies key={geoUrl} geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        // onMouseEnter={() => {
                                        //     const { NAME_0 } = geo.properties;
                                        //     setTooltipContent(NAME_0);
                                        // }}
                                        // onMouseLeave={() => {
                                        //     setTooltipContent("");
                                        // }}
                                        style={{
                                            default: {
                                                fill: "#808080",
                                                stroke: "#212529",
                                                strokeWidth: 0.75,
                                                outline: "none"
                                            },
                                            hover: {
                                                fill: "#e6dfd9",
                                                stroke: "#212529",
                                                strokeWidth: 0.75,
                                                outline: "none"
                                            }
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                    ))}
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
};

export default VietnamMap;
