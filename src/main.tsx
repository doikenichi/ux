
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import ScreenReaderSim from "./app/devtools/ScreenReaderSim.tsx";
  import "./styles/index.css";

  // ScreenReaderSim só renderiza algo com ?a11y=1 na URL.
  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <ScreenReaderSim />
    </>,
  );
  