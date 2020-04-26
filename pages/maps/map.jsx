import React from "react";
import { createApolloFetch } from "apollo-fetch";
import {
  FeatureGroup,
  LayersControl,
  Map,
  Popup,
  TileLayer,
  LayerGroup,
  GeoJSON,
} from "react-leaflet";
import { ALL_PREDIOS } from "../../apollo/queries/predios";
import { INSERT_PREDIO } from "../../apollo/mutations/predios";
import _ from "lodash";
import { Button } from "@blueprintjs/core";
import { EditControl } from "react-leaflet-draw";
const { BaseLayer, Overlay } = LayersControl;
import { geojson } from "./geojson";
const center = [7.00954958159228, -75.69189548492432];
const fetch = createApolloFetch({
  uri: "http://localhost:4000/graphql",
});

class Mapa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recibidos: [],
    };
  }
  locales = [];

  onGuardarClickHandler = (e) => {
    _.map(this.locales, (geos) => {
      fetch({
        query: INSERT_PREDIO,
        variables: { shape: geos },
      }).then((res) => {
        console.log(res.data);
      });
    });
  };
  /*
  onGuardarClickHandler = (e) => {
  _.map(poly,geos =>{
    fetch({
      query: INSERT_PREDIO,
      variables: { shape: geos.geometry },
    }).then((res) => {
      console.log(res.data);
    });
  })
*/
  onLeerClickHandler = (e) => {
    fetch({
      query: ALL_PREDIOS,
    })
      .then((res) =>
        _.map(res.data.allPredios.nodes, (predios) =>
          JSON.parse(JSON.stringify(predios))
        )
      )
      .then((geo) => this.setState({ recibidos: geo }));
  };

  onEachFeature = (feature, layer) => {
    const popupContent = ` <Popup><p>Customizable Popups <br />with feature information.</p><pre>Borough: <br />${feature.properties.name}</pre></Popup>`
    layer.bindPopup(popupContent)
  };
  render() {
    return (
      <div>
        <h1>Mapa</h1>
        <Map style={{ height: "480px" }} center={center} zoom={17}>
          <LayersControl position="topright">
            <FeatureGroup>
              <EditControl
                position="topleft"
                onCreated={this.onCreated}
                draw={{
                  rectangle: {
                    showArea: true,
                    showLength: true,
                    metrics: ["m"],
                  },
                  polygon: {
                    showArea: true,
                    showLength: true,
                    metrics: ["m"],
                  },
                  circle: false,
                  polyline: false,
                  marker: false,
                  circlemarker: false,
                }}
                edit={{
                  edit: false,
                  remove: true,
                }}
              />
            </FeatureGroup>
            <BaseLayer checked name="Mapa">
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer name="Mapa blanco y negro">
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            {!_.isEmpty(this.state.recibidos) && (
              <Overlay checked name="Recibidos">
                
                <GeoJSON
                  data={_.map(this.state.recibidos, (predio) => ({
                    type: "Feature",
                    geometry: JSON.parse(predio.shape.geojson),
                    properties: {
                      id: predio.id,
                    },
                  }))}
                  
                  style={{
                    color: "black",
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: "red",
                  }}
                  onEachFeature={this.onEachFeature}
                />
              </Overlay>
            )}
          </LayersControl>
        </Map>

        <Button text="Guardar" onClick={this.onGuardarClickHandler} />
        <Button text="Leer" onClick={this.onLeerClickHandler} />
      </div>
    );
  }
}
export default Mapa;