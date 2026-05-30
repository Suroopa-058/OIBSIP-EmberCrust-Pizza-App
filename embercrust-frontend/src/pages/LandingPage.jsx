import Hero from '../components/landing/Hero'
import FeaturedPizzas from '../components/landing/FeaturedPizzas'
import WhyChooseUs from '../components/landing/WhyChooseUs'
import Deals from '../components/landing/Deals'
import Testimonials from '../components/landing/Testimonials'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturedPizzas />
      <WhyChooseUs />
      <Deals />
      <Testimonials />
    </>
  )
}