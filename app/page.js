import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Demos from "../components/Demos";
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
      	<Demos /> 
        <Contact />
      </main>
      <Footer />
    </>
  )
}
