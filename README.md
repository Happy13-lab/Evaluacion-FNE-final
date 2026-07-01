# TableFlow - Sistema de Reservas para Bistro Fusión

**TableFlow** es una aplicación SPA (Single Page Application) diseñada en **React + Vite** para optimizar la gestión de reservas de mesas, ocupación de aforo en tiempo real y asignación de clientes para el restaurante boutique **Bistro Fusión**.

Este proyecto ha sido desarrollado como base técnica para la **Evaluación 3: Desarrollo Inicial de una SPA con React + Vite e Integración de IA**.

---

## 1. Cliente y Problemática

### El Cliente
*   **Nombre:** Bistro Fusión
*   **Administrador:** Carlos
*   **Contexto:** Un restaurante boutique de alta cocina que dispone de 12 mesas distribuidas entre un salón principal cerrado y una terraza al aire libre. La terraza es altamente demandada en días soleados pero inutilizable bajo condiciones climáticas adversas.

### La Problemática Detectada
1.  **Desorganización y Overbooking:** Las reservas se toman de forma manual a través de llamadas, WhatsApp e Instagram DM, y son anotadas en una libreta de papel física. Esto conduce a sobreventas y reservas duplicadas en horas pico.
2.  **Desconexión de Aforo:** El equipo de recepción no conoce en tiempo real qué mesas están libres, reservadas u ocupadas sin inspeccionar visualmente el salón.
3.  **Gestión Climatológica Ineficiente:** Al no anticipar las lluvias o el frío, a menudo se reservan mesas en la terraza que luego deben cancelarse o reubicarse apresuradamente, generando fricción con los clientes.
4.  **Falta de Registro de Preferencias:** No existe un registro centralizado sobre restricciones alimenticias (celiacos, veganos, alergias) ni solicitudes especiales (mesas de cumpleaños, sillas de bebé).

### Objetivo de la Solución
Desarrollar una interfaz digital tipo Panel de Control interactivo que unifique las reservas del día, represente visualmente la distribución del salón (mesas interactivas), controle los estados de ocupación de forma dinámica y permita simular factores externos (como el clima) para prevenir el agendamiento erróneo de mesas.

---

## 2. Funcionalidades Propuestas y Avance

### Funcionalidades Implementadas (Evaluación 3):
*   **Dashboard de Métricas:** Visualización en tiempo real de la tasa de ocupación (%), total de reservas activas, cubiertos estimados (comensales) y lista rápida de próximos arribos.
*   **Mapa Interactivo del Salón (TableLayout):** Representación visual y cromática del estado de las 12 mesas del restaurante (Libre: verde, Reservada: naranja, Ocupada: rojo). Incluye acciones rápidas para registrar clientes ("Sentar") y liberar mesas ("Limpiar").
*   **Gestor y Buscador de Reservas:** Filtros por estado de reserva (Pendiente, Confirmada, Sentado, Cancelada) y búsqueda por nombre de cliente, correo o teléfono con actualización instantánea.
*   **Formulario de Reserva Inteligente (ReservationForm):** Formulario controlado para ingresar nuevos registros con:
    *   *Sugerencia de mesas:* Indica mesas libres adecuadas para el número de comensales.
    *   *Alerta de capacidad:* Advierte si el número de comensales excede el aforo de la mesa seleccionada.
    *   *Alerta de terraza:* Bloquea e impide reservar mesas exteriores si la terraza está cerrada.
*   **Simulador de Clima Integrado:** Widget en cabecera que simula clima soleado/lluvioso, inhabilitando visualmente la terraza y alertando si hay reservas activas en riesgo.

### Funcionalidades Futuras (Planificadas para Evaluación 4):
*   **Persistencia Local (localStorage):** Guardar permanentemente las reservas y estados de mesa para evitar pérdidas de información al refrescar la página.
*   **Operaciones CRUD Completas:** Habilitar la edición de datos de reservas existentes y eliminación lógica (borrado).
*   **Integración con API del Clima Externa:** Consumir una API meteorológica pública (ej. OpenWeatherMap) mediante fetch/axios para bloquear la terraza de forma automatizada según el pronóstico real de Santiago.
*   **Validaciones Avanzadas:** Reglas estrictas para inputs (correos válidos, formatos telefónicos, fecha mínima equivalente a hoy).

---

## 3. Estructura del Proyecto

El proyecto mantiene una estructura modular y limpia:

```
/src
  /assets/            -> Elementos gráficos y logotipos
  /components/        -> Componentes de interfaz reutilizables
    ├── Header.jsx          -> Cabecera, navegación y simulador de clima
    ├── Dashboard.jsx       -> Indicadores rápidos y alertas de capacidad
    ├── TableLayout.jsx     ├── Mapa visual de las mesas (salón vs terraza)
    ├── ReservationList.jsx └── Tabla de reservas con buscador y filtros
    └── ReservationForm.jsx └── Modal de formulario interactivo con validaciones
  /data/              -> Set de datos simulados iniciales
    ├── mockTables.js       -> Estado base de las 12 mesas
    └── mockReservations.js -> Reservas de muestra del día
  /styles/            -> Estilos visuales
    └── index.css           -> CSS principal con variables premium y glassmorphism
  ├── App.css         -> Archivo auxiliar limpio
  ├── App.jsx         -> Orquestador de vistas, estados y lógica global
  └── main.jsx        -> Inicializador de React
```

---

## 4. Evidencia del Uso de Inteligencia Artificial

Durante el desarrollo de esta SPA, se utilizó Inteligencia Artificial como asistente de co-programación. A continuación se presentan los prompts principales, recomendaciones obtenidas y decisiones tomadas:

### Prompt 1: Definición de Problemática y Clientela
> **Usuario:** "Necesito crear un proyecto escolar en React + Vite. Debe resolver una problemática real o ficticia de un cliente y poder escalar a CRUD y conexión de API externa en el futuro. Dame una idea sobre un gestor de reservas de un restaurante boutique."
> 
> **Recomendación de la IA:** Sugirió un sistema llamado **TableFlow** para un restaurante llamado **Bistro Fusión**. Propuso añadir un mapa visual de mesas (salón vs terraza) para darle un factor visual diferencial y propuso simular el clima como puente para la futura API de clima externa (que restringiría el uso de la terraza).
> 
> **Decisión Tomada:** Se adoptó esta idea ya que permite una excelente visualización del estado (React Hooks), un diseño estético atractivo y una justificación clara para consumir una API externa en la Evaluación 4.

### Prompt 2: Estructuración del Estado Sincronizado
> **Usuario:** "Tengo dos listas de datos en React: una de mesas (con estados libre/reservada/ocupada) y una de reservas (con estados pendiente/confirmada/sentado/cancelada). ¿Cómo sincronizo ambas colecciones en el estado global para que al cambiar una reserva cambie el color de la mesa asociada?"
> 
> **Recomendación de la IA:** Propuso dos enfoques:
> 1. *Enfoque Derivado:* Calcular el estado de las mesas dinámicamente en cada render buscando en el array de reservaciones.
> 2. *Enfoque Sincronizado:* Mantener dos estados de React (`reservations` y `tables`) y actualizar ambos en funciones controladoras (`handleUpdateStatus`, `handleCreateReservation`).
> 
> **Decisión Tomada:** Se eligió el segundo enfoque (Enfoque Sincronizado) debido a que en el futuro la base de datos mantendrá registros de mesas estáticos y reservas dinámicas, y permite a los administradores realizar acciones directas sobre las mesas (como liberarlas manualmente sin borrar el historial de reservas).

### Prompt 3: Reglas del Formulario Inteligente
> **Usuario:** "Escribe el código para el formulario de reservas en React. Necesito que valide si la capacidad de la mesa seleccionada es menor a la cantidad de personas que van, y que sugiera automáticamente mesas libres que sí cumplan con la capacidad."
> 
> **Recomendación de la IA:** Sugirió usar un hook `useEffect` en el componente del formulario que escuche los cambios en los estados locales `guests` y `tableId`. A partir de ahí, buscar la mesa seleccionada, comparar capacidades y filtrar el listado de mesas para generar "chips" de sugerencia rápida.
> 
> **Decisión Tomada:** Se implementó esta lógica de alertas visuales inmediatas. Si el usuario escribe 6 personas y selecciona la Mesa 1 (capacidad 2), aparece una alerta roja de advertencia, y al costado se muestran botones para autocompletar con la Mesa 5 o la Mesa 12 (que sí tienen capacidad de 6).

---

## 5. Historial de Git y Buenas Prácticas

El proyecto se estructuró a través del uso formal de Git mediante ramas de desarrollo para evitar modificar la rama principal `main` directamente:

1.  **Configuración Inicial (`main`):**
    *   Estructura base del proyecto generada por Vite.
    *   *Commit:* `chore: inicializar estructura de proyecto con React y Vite`
2.  **Desarrollo de Interfaz (`feature/components`):**
    *   Construcción de `Header`, `Dashboard`, `TableLayout` (mapa de mesas), `ReservationList` y estilos visuales en `index.css`.
    *   *Commit:* `feat: implementar componentes UI y datos simulados para reservaciones`
    *   *Fusión:* Integración limpia a `main` mediante `git merge`.
3.  **Lógica y Orquestación (`feature/state`):**
    *   Implementación de estados globales de React, control de vistas en `App.jsx`, flujos de adición, cancelación, borrado y simulación climática.
    *   *Commit:* `feat: orquestar estado global y flujos de reserva en App.jsx`
    *   *Fusión:* Integración final a `main`.

---

## 6. Instrucciones de Ejecución

Para iniciar el proyecto de forma local:

1.  Asegurar tener instalado [Node.js](https://nodejs.org/).
2.  Instalar las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  Iniciar el servidor de desarrollo local:
    ```bash
    npm run dev
    ```
4.  Abrir la dirección local mostrada en la terminal (ej: `http://localhost:5173`) en el navegador.
