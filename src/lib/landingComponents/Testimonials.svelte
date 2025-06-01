<script>
  const testimonials = [
    {
      name: "María González",
      role: "Emprendedora",
      content: "Saldo cambió completamente la forma en que manejo mis finanzas. En 6 meses he ahorrado más que en los últimos 2 años.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Carlos Ruiz",
      role: "Freelancer",
      content: "Como trabajador independiente, necesitaba una herramienta que me ayudara a organizar mis ingresos variables. Saldo es perfecta.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Ana Martín",
      role: "Estudiante",
      content: "La interfaz es súper intuitiva y las funciones de ahorro automático me han ayudado mucho con mi presupuesto de estudiante.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];
</script>

<section class="py-20 bg-gradient-to-br from-blue-50 to-green-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">
        Lo que dicen nuestros usuarios
      </h2>
      <p class="text-xl text-gray-600">
        Miles de personas ya están transformando sus finanzas con Saldo
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      {#each testimonials as testimonial}
        <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center mb-4">
            {#each Array(testimonial.rating) as _, i}
              <svg class="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            {/each}
          </div>
          <p class="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
          <div class="flex items-center">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h4 class="font-semibold text-gray-900">{testimonial.name}</h4>
              <p class="text-gray-600 text-sm">{testimonial.role}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>