import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Link } from "react-router-dom";

import jadePlant from "../jade-plant.jpg";
import spiderPlant from "../spider-plant.jpg";
import basilPlant from "../basil-plant.jpg";
import plantBackground from "../plant-background.png";

const brokerUrl = "ws://test.mosquitto.org:8080/mqtt";

const TEMP_TOPIC = "plant/temp";
const WATERLEVEL_TOPIC = "plant/waterlevel";

function PlantTile({ image, alt, link }) {
  return (
    <Link to={link} className="plant-tile">
      <img src={image} alt={alt} className="plant-image large-plant-image" />
    </Link>
  );
}

export default function HomePage() {
  const [temperature, setTemperature] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log("Connected to MQTT broker on HomePage");
      client.subscribe(TEMP_TOPIC);
      client.subscribe(WATERLEVEL_TOPIC);
    });

    client.on("message", (topic, messageBuffer) => {
      const message = messageBuffer.toString();
      if (topic === TEMP_TOPIC) {
        setTemperature(parseInt(message, 10));
      } else if (topic === WATERLEVEL_TOPIC) {
        setWaterLevel(parseInt(message, 10));
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>My Plant Care</h1>

      {/* Row of plant tiles */}
      <div>
        <PlantTile image={basilPlant} alt="Basil Plant" link="/basil" />
        <PlantTile image={spiderPlant} alt="Spider Plant" link="/spider" />
        <PlantTile image={jadePlant} alt="Jade Plant" link="/jade" />
      </div>

      {/* Status tiles row */}
      <div>
        {/* Temperature tile */}
        <div>
          <h2>Temperature Status</h2>
          <p>{temperature !== null ? `${temperature}°C` : "Loading..."}</p>
        </div>

        {/* Water level tile */}
        <div>
          <h2>Water Level Status</h2>
          <p>{waterLevel !== null ? `${waterLevel}%` : "Loading..."}</p>
        </div>
      </div>
    </div>
  );
}
