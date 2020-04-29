import _ from 'lodash';
export const prediosToGeoJSON = (json) => (
    _.map(json, (predio) => ({
        type: "Feature",
        geometry: JSON.parse(predio.shape.geojson),
        properties: {
          id: predio.id,
        },
      }))
)