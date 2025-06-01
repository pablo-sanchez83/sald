<script>
import { Check } from "lucide-svelte";

  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      description: "Perfecto para empezar a organizar tus finanzas",
      features: [
        "Hasta 2 cuentas bancarias",
        "Categorización básica de gastos",
        "Reportes mensuales",
        "Soporte por email"
      ],
      buttonText: "Empezar gratis",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Premium",
      price: "€9.99/mes",
      description: "Para usuarios que quieren el control total",
      features: [
        "Cuentas bancarias ilimitadas",
        "Análisis avanzado con IA",
        "Metas de ahorro personalizadas",
        "Alertas inteligentes",
        "Exportación de datos",
        "Soporte prioritario 24/7"
      ],
      buttonText: "Prueba 30 días gratis",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Familia",
      price: "€19.99/mes",
      description: "Gestión financiera para toda la familia",
      features: [
        "Todo lo de Premium",
        "Hasta 6 usuarios",
        "Cuentas compartidas",
        "Control parental",
        "Reportes familiares",
        "Gestor personal dedicado"
      ],
      buttonText: "Empezar ahora",
      buttonVariant: "outline",
      popular: false
    }
  ];
</script>
  
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Planes diseñados para cada necesidad
          </h2>
          <p class="text-xl text-gray-600">
            Comienza gratis y actualiza cuando necesites más funciones
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {#each plans as plan}
            <div class={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              plan.popular 
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-green-50 shadow-xl" 
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}>
              {#if plan.popular}
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span class="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Más popular
                  </span>
                </div>
              {/if}
              
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div class="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <p class="text-gray-600">{plan.description}</p>
              </div>
              
              <ul class="space-y-4 mb-8">
                {#each plan.features as feature}
                  <li class="flex items-center">
                    <Check class="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">{feature}</span>
                  </li>
                {/each}
              </ul>
              
              <button
                class={`btn btn-${plan.buttonVariant} w-full py-3 font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular 
                    ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg" 
                    : ""
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
        {/each}
        </div>
      </div>
    </section>
