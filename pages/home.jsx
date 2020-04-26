import dynamic from "next/dynamic";
import Head from "next/head";
const Mapa = dynamic(() => import("./maps/map"), { ssr: false });
/*
sirgas - proyeccion suramerica
magna - colombia

*/

const Home = () => {
  return (
      <div>
        <Head>
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css"
          />
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css"
          />
          <link rel="stylesheet" href="style.css" />
          
        </Head>
        <Mapa />
      </div>
  );
};

export default Home;
