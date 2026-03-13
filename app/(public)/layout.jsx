// app/(public)/layout.js
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="pt-24">
        {children}
      </div>

      <Footer />
    </>
  );
}
