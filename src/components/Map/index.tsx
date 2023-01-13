import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import "./Map.scss";
import Geo from './features.json'
import Editable from "../Editable";
import { isNotEmpty } from "../../helpers";

type MapProps = {
    lat: string | undefined,
    long: string | undefined,
    isEditable: boolean,
    onChangeLatitude: (value: string) => void,
    onChangeLongitude: (value: string) => void,
    shouldRenderMap?: boolean,
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// FIXME: Need investigation: Map is not resized after screen resizing
const Map = ({ lat, long, isEditable, onChangeLatitude, onChangeLongitude, shouldRenderMap = true }: MapProps) => {
    const coordinatesExist = isNotEmpty(lat) && isNotEmpty(long);

    const [position, setPosition]: any = useState({
        coordinates: coordinatesExist ? [Number(long), Number(lat)] : undefined,
        zoom: coordinatesExist ? 4 : 1
    });
  
    function handleMoveEnd(position: any) {
        setPosition(position);
    }

    return (
        <div className="map-container">
            <div className="coordinates">
                <Editable
                    label="Latitude"
                    showLabel={isNotEmpty(lat)}
                    value={lat}
                    fieldType="text"
                    type="number"
                    isEditable={isEditable}
                    onChange={onChangeLatitude}
                />
                <Editable
                    label="Longitude"
                    showLabel={isNotEmpty(long)}
                    value={long}
                    fieldType="text"
                    type="number"
                    isEditable={isEditable}
                    onChange={onChangeLongitude}
                />
            </div>
            <div className="map">
                {
                    shouldRenderMap && (
                        <ComposableMap
                            width={MAP_WIDTH}
                            height={MAP_HEIGHT}
                        >
                            <ZoomableGroup
                                zoom={position.zoom}
                                center={position.coordinates}
                                onMoveEnd={handleMoveEnd}
                                translateExtent={[
                                    [0, 0],
                                    [MAP_WIDTH, MAP_HEIGHT]
                                ]}
                            >
                                <Geographies geography={Geo}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => (
                                            <Geography
                                                className="geography" 
                                                key={geo.rsmKey} 
                                                geography={geo} 
                                            />
                                        ))
                                    }
                                </Geographies>
                                { coordinatesExist && (
                                    <Marker coordinates={[ Number(long), Number(lat)]}>
                                        <circle r={10 / position.zoom} className="point" />
                                    </Marker>
                                )}
                            </ZoomableGroup>
                        </ComposableMap>
                    )
                }
            </div>
        </div>
    )
}
        
export default Map;
