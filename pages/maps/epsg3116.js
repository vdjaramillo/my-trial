import L from 'proj4leaflet';

const crs = new L.Proj.CRS('EPSG:3116',
  '+proj=tmerc +lat_0=4.596200416666666 +lon_0=-77.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  {
    resolutions: [
      8192, 4096, 2048, 1024, 512, 256, 128,
    ],
    origin: [0, 0],
  });

export default crs;
