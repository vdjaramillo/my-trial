import { Polygon, Popup, FeatureGroup } from 'react-leaflet';
import React from 'react';

const Poly = ({ feature, index }) => (
  <FeatureGroup onClick={() => console.log('46798')} color="purple" key={index}>
    <Popup key={index}>
      <p>ghgj</p>
    </Popup>
    <Polygon
      positions={[_.map(feature.geometry.coordinates[0], (coord) => coord.reverse())]}
    />
  </FeatureGroup>
);
export default Poly;
