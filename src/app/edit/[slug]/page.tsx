"use client";

import AppContainer from "@/components/AppContainer";
import BackButton from "@/components/BackButton";
import { EditContainer } from "@/components/EditContainer";
import { Header } from "@/components/Header";
import mqtt from "mqtt";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPage() {
  const params = useParams();
  const slug = params.slug as string || "";

  const [plantmode, plantsetMode] = useState("manual");
  const [plantwaterFrequency, plantsetWaterFrequency] = useState("1");
  const [plantwaterAmount, plantsetWaterAmount] = useState("50");
  const [showSaved, setShowSaved] = useState(false);

    const brokerUrl = "wss://test.mosquitto.org:8081/mqtt";
  const plantwaterTopic = `plantc28fa/${slug.toLowerCase()}/water`;

  useEffect(() => {
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log("Successfully connected to broker");

      // Subscribe to the plant water topic
      // If the message is retained, we get it immediately
      client.subscribe(plantwaterTopic);
    });

    // When messages arrive, parse them to update the schedule
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

    // Cleanup on unmount
    return () => {
      client.end();
    };
  }, []);

  const plantwaterSettingsChange = () => {
    const plantclient = mqtt.connect(brokerUrl);
    let plantmessage;

    if (plantmode === "manual") {
      // CSV format: "manual,amount,frequency"
      plantmessage = `${plantmode},${plantwaterAmount},${plantwaterFrequency}`;
    } else {
      // e.g. "preset,0,0"
      plantmessage = `${plantmode},0,0`;
    }

    // Publish with retain=true so the broker stores the last known schedule
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
