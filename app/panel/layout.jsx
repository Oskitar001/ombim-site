import PanelAuth from "./panel-auth";

export default function PanelLayout({ children }) {
  return (
    <PanelAuth>
      <div className="pt-[88px] px-6">
        {children}
      </div>
    </PanelAuth>
  );
}
