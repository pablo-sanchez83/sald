<script>
  import Features from "$lib/landingComponents/Features.svelte";
  import Footer from "$lib/landingComponents/Footer.svelte";
  import Header from "$lib/landingComponents/Header.svelte";
  import Hero from "$lib/landingComponents/Hero.svelte";
  import Pricing from "$lib/landingComponents/Pricing.svelte";
  import Testimonials from "$lib/landingComponents/Testimonials.svelte";
</script>

<div class="min-h-screen">
  <Header />
  <main>
    <Hero />
    <Features />
    <Testimonials />
    <Pricing />
  </main>
</div>
