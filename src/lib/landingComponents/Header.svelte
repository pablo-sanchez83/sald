<script>
  import { Menu, X } from "lucide-svelte";
  import { writable } from "svelte/store";

  const isMenuOpen = writable(false);
</script>

<header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Saldo
        </h1>
      </div>
      
      <nav class="hidden md:flex items-center space-x-8">
        <a href="#inicio" class="text-gray-600 hover:text-gray-900 transition-colors">Inicio</a>
        <a href="#caracteristicas" class="text-gray-600 hover:text-gray-900 transition-colors">Características</a>
        <a href="#precios" class="text-gray-600 hover:text-gray-900 transition-colors">Precios</a>
        <a href="#contacto" class="text-gray-600 hover:text-gray-900 transition-colors">Contacto</a>
      </nav>
      
      <div class="hidden md:flex items-center space-x-4">
        <button class="text-gray-600 hover:text-gray-900 btn btn-ghost">
          Iniciar sesión
        </button>
        <button class="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white btn">
          Empezar gratis
        </button>
    </div>
      
      <button
        class="md:hidden"
        on:click={() => $isMenuOpen = !$isMenuOpen}
      >
        {#if $isMenuOpen}
          <X class="h-6 w-6" />
        {:else}
          <Menu class="h-6 w-6" />
        {/if}
      </button>
    </div>
    
    {#if $isMenuOpen}
      <div class="md:hidden py-4 border-t border-gray-100">
        <nav class="flex flex-col space-y-4">
          <a href="#inicio" class="text-gray-600 hover:text-gray-900 transition-colors">Inicio</a>
          <a href="#caracteristicas" class="text-gray-600 hover:text-gray-900 transition-colors">Características</a>
          <a href="#precios" class="text-gray-600 hover:text-gray-900 transition-colors">Precios</a>
          <a href="#contacto" class="text-gray-600 hover:text-gray-900 transition-colors">Contacto</a>
          <div class="flex flex-col space-y-2 pt-4">
            <button class="text-gray-600 hover:text-gray-900 justify-start btn btn-ghost">
              Iniciar sesión
            </button>
            <button class="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white justify-start btn">
              Empezar gratis
            </button>
          </div>
        </nav>
      </div>
    {/if}
  </div>
</header>