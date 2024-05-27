import Main from "./vis/index"
import "./lib/index.css"

import * as React from "react"
import * as ReactDOM from "react-dom/client"

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
