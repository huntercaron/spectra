
import Main from "./vis/index"
import "./lib/index.css"
import * as React from "react"
import * as ReactDOM from "react-dom"

ReactDOM.render(<Main />, document.getElementById("root"))

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept()
}
