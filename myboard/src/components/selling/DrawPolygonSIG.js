import { useEffect, useState } from 'react';
import { Polygon } from 'react-kakao-maps-sdk';
import SIG from '../../resources/AL_D001_00_20240209(SIG)_simplify.json';
import axios from 'axios';

const DrawPolygonSIG = (props) => {

    const [polygonColors, setPolygonColors] = useState([...props.polygonColors,]);
    const [areas, setAreas] = useState([
        ...SIG.features.map((area, index) => ({
            areacode : (area.properties.A1+'00000'),
            path : (
                area.geometry.type === 'Polygon' ?
                      area.geometry.coordinates[0].map((lnglat) => ({lng : lnglat[0], lat : lnglat[1]})) // Polygon
                    : area.geometry.coordinates.map(polygon => (polygon[0].map((lnglat) => ({lng : lnglat[0], lat : lnglat[1]})))) // MultiPolygon
            ),
            areaname : area.properties.A2,
            isMouseover : false,
            densityArr : polygonColors.filter(a => a.region_code === (area.properties.A1+'00000')),
        }))
    ]);
    
    return (
        <>
            {areas.map((area, index) => (
                <Polygon
                    key = {area.areacode}
                    path = {area.path}
                    strokeWeight={2}
                    strokeColor = {"#004c80"}
                    strokeOpacity = {0.8}
                    fillColor = {
                        area.isMouseover ? '#E91E63'
                            : (area.densityArr.length === 1 ? (area.densityArr[0].density) : '#2196F3')
                    }
                    fillOpacity = {0.8}
                    onMouseover = {() => setAreas((prev) => [
                        ...prev.filter((_, i) => i !== index),
                        {
                            ...prev[index],
                            isMouseover : true,
                        }
                    ])}
                    onMouseout = {() => setAreas((prev) => [
                        ...prev.filter((_, i) => i !== index),
                        {
                            ...prev[index],
                            isMouseover : false,
                        }
                    ])}
                    onClick = {(_polygon, mouseEvent) => props.parentClickListener(_polygon, {areacode : (area.areacode + '0000000000').slice(0, 10), regionDepth : 2})}
                    // onClick={(polygon, mouseEvent) => console.log(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng())}
                />
            ))}
        </>
    );
};
/*
SIG
    features
        type
        geometry
            type - Polygon 또는 MultiPolygon
            coordinates
        properties
            "A0":2,"A1":"52113","A2":"전주시덕진구","A3":"2024-02-06","A4":"52110"
*/
export default DrawPolygonSIG;

