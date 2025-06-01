<script>
    import { ArrowRight, Monitor, Shield, TrendingUp } from "lucide-svelte";

</script>
    <section class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen flex items-center">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Controla tus
                <span class="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {" "}finanzas
                </span>
                <br />
                como nunca antes
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                Saldo te ayuda a gestionar tu dinero de forma inteligente. 
                Registra gastos, controla presupuestos y alcanza tus metas financieras con nuestra plataforma web.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <a 
                class="btn btn-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                href="/signup"
                >
                Empezar gratis
                <ArrowRight class="ml-2 h-5 w-5" />
              </a>
              <a 
                class="btn btn-lg btn-outline px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                href="/demo"
                >
                Ver demo
              </a>
            </div>
            
            <div class="flex items-center space-x-8 pt-4">
              <div class="flex items-center space-x-2">
                <Shield class="h-5 w-5 text-green-600" />
                <span class="text-sm text-gray-600">100% Seguro</span>
              </div>
              <div class="flex items-center space-x-2">
                <Monitor class="h-5 w-5 text-blue-600" />
                <span class="text-sm text-gray-600">Plataforma web</span>
              </div>
              <div class="flex items-center space-x-2">
                <TrendingUp class="h-5 w-5 text-green-600" />
                <span class="text-sm text-gray-600">Control total</span>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 shadow-2xl">
              <div class="bg-white rounded-2xl p-6 shadow-lg">
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">Balance Total</h3>
                    <TrendingUp class="h-5 w-5 text-green-600" />
                  </div>
                  <div class="text-3xl font-bold text-gray-900">€12,847.52</div>
                  <div class="text-sm text-green-600">+€1,234 este mes</div>
                  
                  <div class="space-y-3 pt-4">
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span class="text-sm font-medium">Gastos</span>
                      <span class="text-sm text-red-600">-€2,341</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span class="text-sm font-medium">Ingresos</span>
                      <span class="text-sm text-green-600">+€4,200</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span class="text-sm font-medium">Ahorros</span>
                      <span class="text-sm text-blue-600">€8,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>