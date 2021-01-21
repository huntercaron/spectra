
import Main from "./main"
import "./lib/index.css"

window.ReactDOM.render(<Main />, document.getElementById("root"))

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept()
}
