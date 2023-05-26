import {
    defineConfig
} from "npm:vite@^3.1.3";
import react from "npm:@vitejs/plugin-react@^2.1";

import "npm:react@^18.2";
import "npm:react-dom@^18.2/client";
import "npm:react-router-dom@^6.4"; // Add this line

export default defineConfig({
    plugins: [react()],
});