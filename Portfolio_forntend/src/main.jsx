import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router";
import { AppProvider } from "./context/AppContext";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/", element: <Home /> },
//       {
//         path: "/about",
//         element: <About />,
//       },
//       {
//         path: "/project",
//         element: <Project />,
//       },
//       {
//         path: "/project/:projectId", // Dynamic route
//         element: <Singal_post />,
//       },
//       {
//         path: "/contact",
//         element: <Contact />,
//       },
//       // {
//       //   path: "/admin",
//       //   element: <Layout />,
//       //   children: [],
//       // },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
