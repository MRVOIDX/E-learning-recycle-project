import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { localStorageManager } from "./lib/storage";

// Initialize default admin user on app startup
localStorageManager.initializeDefaultAdmin();

createRoot(document.getElementById("root")!).render(<App />);
