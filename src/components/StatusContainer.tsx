"use client";
// Import MQTT library
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import StatusTile from "./StatusTile";

// Handles MQTT data and shows sensor tiles.
export default function StatusContainer() {
  // Defines MQTT broker URL
  const brokerUrl = "wss://test.mosquitto.org:8081/mqtt";

  // Defines topics
  const TEMP_TOPIC = "plantc28fa/temp";
  const WATERLEVEL_TOPIC = "plantc28fa/waterlevel";

  // Makes state variables
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [waterLevel, setWaterLevel] = useState<number | undefined>(undefined);

  // UseEffect hook to run MQTT logic while showing data
  useEffect(() => {
    // Connect to broker
    console.log(`useeffect `);
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log(`connect`);
      console.log("Connected to MQTT broker on HomePage"); //take out after testing
      // Subscribe to topics
      client.subscribe(TEMP_TOPIC);
      client.subscribe(WATERLEVEL_TOPIC);
    });

    // Get messages from the broker
    client.on("message", (topic, messageBuffer) => {
      const message = messageBuffer.toString();
      console.log(`message `);

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

  // Display sensor tiles
  return (
    <div className="flex justify-center gap-8 mt-8">
      <StatusTile
        name="Temperature"
        value={temperature ? `${temperature}°C` : "Loading..."}
      />
      <StatusTile
        name="Water Level"
        value={waterLevel ? `${waterLevel}%` : "Loading..."}
      />
    </div>
  );
}
