import { Polygon, Popup, FeatureGroup } from 'react-leaflet';
import React from 'react';

const Poly = ({ feature, index, onClick }) => {
  const features=JSON.parse(JSON.stringify(feature));
  return(<FeatureGroup onClick={onClick} color="purple" key={index}>
    <Popup key={index}>
      <p>ghgj</p>
    </Popup>
    <Polygon
      positions={[_.map(features.geometry.coordinates[0], (coord) => coord.reverse())]}
    />
  </FeatureGroup>
  );
};
export default Poly;
