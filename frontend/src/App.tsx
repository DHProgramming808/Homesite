import { useEffect, useState } from "react";
import { getInfo } from "./api";
import './App.css'

function App() {
  const [info, setInfo] = useState<{ name?: string; framework?: string; version?: string } | null>(null);

  useEffect(() => {
    getInfo().then(data => setInfo(data));
  }, []);

  if (!info) return <div>Loading...</div>

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{info.name}</h1>
      <p>Framework: {info.framework}</p>
      <p>Version: {info.version}</p>
    </div>
  )

}


export default App
