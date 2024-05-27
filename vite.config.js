import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

const ReactCompilerConfig = {
  /* ... */
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
})
