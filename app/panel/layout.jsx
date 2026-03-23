// ❌ NO pongas "use client" aquí

import PanelAuth from "./panel-auth";

export default function PanelLayout({ children }) {
  return <PanelAuth>{children}</PanelAuth>;
}
