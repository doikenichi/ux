
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import ScreenReaderSim from "./app/devtools/ScreenReaderSim.tsx";
  import "./styles/index.css";

  // ScreenReaderSim fica ativo por padrão; ?a11y=0 na URL o desliga.
  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <ScreenReaderSim />
    </>,
  );
  