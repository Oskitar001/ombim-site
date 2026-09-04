import "./globals.css";
import PanelWrapper from "../components/PanelWrapper";

export const metadata = {
  title: "OMBIM",
  description: "Modelado 3D y software para Tekla Structures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-[#1b1f24] text-gray-900 dark:text-gray-100 transition-colors">
        <PanelWrapper>{children}</PanelWrapper>
      </body>
    </html>
  );
}