<script>
    import { PiggyBank, BarChart3, CreditCard, Bell, Lock, Calculator } from "lucide-svelte";

  const features = [
    {
      icon: PiggyBank,
      title: "Ahorro Inteligente",
      description: "Establece metas de ahorro y deja que Saldo te ayude a alcanzarlas con seguimiento automático."
    },
    {
      icon: BarChart3,
      title: "Análisis Detallado",
      description: "Visualiza tus gastos con gráficos intuitivos y descubre patrones en tus finanzas."
    },
    {
      icon: CreditCard,
      title: "Control de Gastos",
      description: "Registra y categoriza todos tus gastos manualmente desde una interfaz simple y clara."
    },
    {
      icon: Bell,
      title: "Alertas Personalizadas",
      description: "Recibe notificaciones sobre límites de gasto, vencimientos y oportunidades de ahorro."
    },
    {
      icon: Lock,
      title: "Seguridad Total",
      description: "Tus datos están protegidos con los más altos estándares de seguridad y privacidad."
    },
    {
      icon: Calculator,
      title: "Gestión Manual",
      description: "Controla completamente tus finanzas con registro manual de ingresos y gastos."
    }
  ];
    
  

</script>

<section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas para gestionar tu dinero
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Saldo combina las mejores herramientas financieras en una plataforma web simple, 
            diseñada para hacer que manejar tu dinero sea fácil y efectivo.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each features as feature}
            <div class="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon class="h-6 w-6 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p class="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          {/each}

        </div>
      </div>
    </section>