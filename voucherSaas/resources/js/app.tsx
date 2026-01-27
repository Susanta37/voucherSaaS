import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { initializeTheme } from "./hooks/use-appearance";
import { Toaster } from "sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx"),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                {/* ✅ App is the Inertia root provider */}
                <App {...props} />

                {/* ✅ toaster is outside okay */}
                <Toaster richColors position="top-right" />
            </StrictMode>,
        );
    },

    progress: { color: "#4B5563" },
});

// ✅ keep theme init
initializeTheme();
