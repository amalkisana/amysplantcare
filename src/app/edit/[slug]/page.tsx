"use client";
// PLant schedule page
// Imports plant schedule page components
import AppContainer from "@/components/AppContainer";
import BackButton from "@/components/BackButton";
import { EditContainer } from "@/components/EditContainer";
import { Header } from "@/components/Header";
import mqtt from "mqtt";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function EditPage() {
  const params = useParams();
  // Get the slug from the URL to identify the plant
  const slug = params.slug as string || "";

  // Set the default values for the plant schedule
  const [plantmode, plantsetMode] = useState("manual");
  const [plantwaterFrequency, plantsetWaterFrequency] = useState("1");
  const [plantwaterAmount, plantsetWaterAmount] = useState("50");
  const [showSaved, setShowSaved] = useState(false);

  // Define the MQTT broker URL and topic
    const brokerUrl = "wss://test.mosquitto.org:8081/mqtt";
  const plantwaterTopic = `plantc28fa/${slug.toLowerCase()}/water`;

  // Connect to the MQTT broker and subscribe to the topic
  useEffect(() => {
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {

      // Subscribe to topic
      client.subscribe(plantwaterTopic);
    });

    // Parse message to update the schedule
    client.on("message", (topic, payload) => {
      if (topic === plantwaterTopic) {
        const msgString = payload.toString(); 
        console.log("Received schedule:", msgString);

        // Parse the CSV: "mode,amount,frequency"
        const [incomingMode, incomingAmount, incomingFrequency] =
          msgString.split(",");

        if (incomingMode) {
          plantsetMode(incomingMode);
        }
        if (incomingAmount) {
          plantsetWaterAmount(incomingAmount);
        }
        if (incomingFrequency) {
          plantsetWaterFrequency(incomingFrequency);
        }
      }
    });

    return () => {
      client.end();
    };
  }, []);

  // Publish new schedule to MQTT broker when user presses save
  const plantwaterSettingsChange = () => {
    const plantclient = mqtt.connect(brokerUrl);
    let plantmessage;

    if (plantmode === "manual") {
      // CSV format: "manual,amount,frequency"
      plantmessage = `${plantmode},${plantwaterAmount},${plantwaterFrequency}`;
    } else {
      //sends preset frequency
      const presetFrequency =
    slug === "Jade"
    ? "3"
    : slug === "Basil"
    ? "1"
    : slug === "Spider"
    ? "2"
    : plantwaterFrequency;
      plantmessage = `${plantmode},250,${presetFrequency}`;
    }

    // Publish message with retain flag
    plantclient.publish(plantwaterTopic, plantmessage, {
      qos: 0,
      retain: true,
    });
    console.log("Published schedule:", plantmessage);

    // Show "Saved" for 10s
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 10000);
  };

/// Show the plant schedule page with the edit form
  return (
    <AppContainer>
      <BackButton />
      <Header text={`${slug} Plant Schedule`} />
      <EditContainer
        mode={plantmode}
        setMode={plantsetMode}
        waterFrequency={plantwaterFrequency}
        setWaterFrequency={plantsetWaterFrequency}
        waterAmount={plantwaterAmount}
        setWaterAmount={plantsetWaterAmount}
        waterSettingsChange={plantwaterSettingsChange}
        showSaved={showSaved}
      />
    </AppContainer>
  );
}
