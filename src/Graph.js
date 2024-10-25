import React, { useState, useEffect } from 'react';
import { db, ref, onValue } from './firebaseConfig'; // Corrected import
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './styles.css';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = () => {
  const [sensorData, setSensorData] = useState({ temperatures: [], humidities: [], illuminance: [] });
  const [latestSensorData, setLatestSensorData] = useState(null); // To store the latest sensor reading

  useEffect(() => {
    const dataRef = ref(db, 'sensor/weather'); // Corrected database reference
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const lastTenKeys = keys.slice(-25); // Fetch the last 10 readings
        
        // Extract temperature, humidity, and light illuminance for the chart
        const temperatures = lastTenKeys.map(key => data[key].temperature);
        const humidities = lastTenKeys.map(key => data[key].humidity);
        const illuminance = lastTenKeys.map(key => data[key].lightIntensity); // Assuming 'light' field represents illuminance
        
        // Set the sensor data for chart
        setSensorData({
          temperatures,
          humidities,
          illuminance
        });
        
        // Set the most recent sensor reading for latest display
        const lastKey = keys[keys.length - 1];
        setLatestSensorData(data[lastKey]);
      }
    });
  }, []);

  // Define the data for the chart
  const chartData = {
    labels: Array.from({ length: sensorData.temperatures.length }, (_, i) => i + 1), // Use simple index values for X-axis
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorData.temperatures, // Data points for temperature
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
      {
        label: 'Humidity (%)',
        data: sensorData.humidities, // Data points for humidity
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
      },
      {
        label: 'Light Illuminance (lx)',
        data: sensorData.illuminance, // Data points for light illuminance
        borderColor: 'rgba(255,206,86,1)',
        backgroundColor: 'rgba(255,206,86,0.2)',
        fill: true,
      }
    ]
  };

  // Define options for the chart
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature, Humidity, and Light Illuminance Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Reading Index',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sensor Values',
        },
      },
    },
  };

  return (
    <div>
      <h1>Sensor Data Dashboard</h1>
      
      {/* Latest Sensor Data */}
      {latestSensorData ? (
        <div>
          <p><strong>Latest Temperature:</strong> {latestSensorData.temperature} °C</p>
          <p><strong>Latest Humidity:</strong> {latestSensorData.humidity} %</p>
          <p><strong>Latest Light Illuminance:</strong> {latestSensorData.lightIntensity} lx</p>
        </div>
      ) : (
        <p>Loading latest sensor data...</p>
      )}
      
      {/* Line Chart for last 10 readings */}
      {sensorData.temperatures.length > 0 ? (
        <div>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Graph;
