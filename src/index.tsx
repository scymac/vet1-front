/* eslint-disable */
// React
import React from "react"
import ReactDOM from "react-dom/client"

// Toaster
import { Toaster } from "react-hot-toast"

// Custom
import MainLayout from "./layouts/MainLayout"

// Style
import "./index.css"
import "assets/theme/modal-style.css"

// Web vitals
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
	<React.StrictMode>
		<MainLayout />
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 3000,
				style: {
					borderRadius: "8px",
					background: "#333",
					color: "#fff",
				},
			}}
		/>
	</React.StrictMode>
)

// Optional: measure performance
reportWebVitals()
