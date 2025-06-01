<script>
  import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-svelte';
</script>

<footer class="bg-gray-900 text-white">
  <div class="container mx-auto px-4 py-16">
    <div class="grid md:grid-cols-4 gap-8">
      <div class="space-y-4">
        <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Saldo
        </h3>
        <p class="text-gray-400 leading-relaxed">
          La aplicación de gestión financiera que te ayuda a tomar el control de tu dinero y alcanzar tus metas económicas.
        </p>
        <div class="flex space-x-4">
          <Facebook class="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
          <Twitter class="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
          <Instagram class="h-6 w-6 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
        </div>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold mb-4">Producto</h4>
        <ul class="space-y-2 text-gray-400">
          <li><a href="#" class="hover:text-white transition-colors">Características</a></li>
          <li><a href="#" class="hover:text-white transition-colors">Precios</a></li>
          <li><a href="#" class="hover:text-white transition-colors">Seguridad</a></li>
          <li><a href="#" class="hover:text-white transition-colors">API</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-lg font-semibold mb-4">Contacto</h4>
        <div class="space-y-3 text-gray-400">
          <div class="flex items-center">
            <Mail class="h-5 w-5 mr-3" />
            <span>hola@saldo.app</span>
          </div>
          <div class="flex items-center">
            <Phone class="h-5 w-5 mr-3" />
            <span>+34 900 123 456</span>
          </div>
          <div class="flex items-center">
            <MapPin class="h-5 w-5 mr-3" />
            <span>Madrid, España</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
      <p>&copy; 2024 Saldo. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>