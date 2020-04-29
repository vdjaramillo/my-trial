import React from "react";
import { createApolloFetch } from "apollo-fetch";
import {
  FeatureGroup,
  LayersControl,
  Map,
  TileLayer,
  GeoJSON,
} from "react-leaflet";
import { ALL_PREDIOS } from "../../apollo/queries/predios";
import { INSERT_PREDIO } from "../../apollo/mutations/predios";
import _ from "lodash";
import { Button } from "@blueprintjs/core";
import { EditControl } from "react-leaflet-draw";
const { BaseLayer, Overlay } = LayersControl;
import { poly } from "./poligonos";
import Poly from "./Polygon";
import {municipiosCol} from './municipios_colombia';
import { prediosToGeoJSON } from "./commons";
import { construcciones } from "./construcciones";
import crs from './epsg3116';
const center = [7.00954958159228, -75.69189548492432];
const fetch = createApolloFetch({ uri: "http://localhost:4000/graphql" });

class Mapa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recibidos: [],
      openInfo: false,
      infoPredio:{}
    };
  }
  locales = [];
  componentDidMount() {
    fetch({
      query: ALL_PREDIOS,
    })
      .then((res) =>
        _.map(res.data.allPredios.nodes, (predios) =>
          JSON.parse(JSON.stringify(predios))
        )
      )
      .then((geo) => this.setState({ recibidos: geo }));
  }
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
  onClickPolygon = (e, feature) => {
    this.state.openInfo
      ? this.setState({ openInfo: false })
      : this.setState({ openInfo: true });
    this.setState({infoPredio: feature.properties})
  };
  onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => this.onClickPolygon(e, feature)
    });
  };
  onCreated = (e) => {
    console.log(e);
  }
  render() {
    return (
      <>
        <h1>Mapa</h1>
        <div style={{ verticalAlign: "top" }}>
          {this.state.openInfo && (
            <div  className={"infoPredio"} >
              <h2>Información del predio</h2>
                <h3> id</h3> <h4>{this.state.infoPredio.id}</h4>
            </div>
          )}
          <Map
            className={this.state.openInfo ? "mapaAbierto" : "mapa"}
            center={center}
            zoom={17}
            maxZoom={21}
            crs={crs}
          >
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
                    edit: true,
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
              <Overlay checked name="Construcciones">
                <GeoJSON
                data={construcciones}
                />
              </Overlay>
              {!_.isEmpty(this.state.recibidos) && (
                <Overlay checked name="Recibidos">
                  <GeoJSON
                    data={prediosToGeoJSON(this.state.recibidos)}
                    onEachFeature={this.onEachFeature}
                    className="poly"
                  />
                </Overlay>
              )}
            </LayersControl>
          </Map>
        </div>
        <Button text="Guardar" onClick={this.onGuardarClickHandler} />
        <Button text="Leer" onClick={this.onLeerClickHandler} />
      </>
    );
  }
}
export default Mapa;
