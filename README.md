# Simulador de Precios InspireAI

Este proyecto es un simulador de precios desarrollado con [Next.js](https://nextjs.org) para InspireAI. Permite a los usuarios calcular y visualizar proyecciones de ingresos basadas en diferentes parámetros de precios y clientes.

## Características

- Simulación de ingresos para servicios de contenido y redes sociales
- Cálculos dinámicos basados en tasas de crecimiento y comisiones
- Visualización de datos con gráficos interactivos
- Interfaz de usuario responsive y amigable

## Requisitos Previos

- Node.js 14.0 o superior
- npm o yarn

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/price-simulator-inspireai.git
   cd price-simulator-inspireai
   ```

2. Instala las dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

## Uso

Para iniciar el servidor de desarrollo:

```bash
npm run dev
o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

- `app/`: Contiene las páginas y componentes principales de la aplicación
- `components/`: Componentes reutilizables de React
- `lib/`: Utilidades y funciones auxiliares
- `public/`: Archivos estáticos como imágenes y fuentes

## Personalización

Puedes modificar los parámetros iniciales del simulador en el archivo `components/dashboard.tsx`. Ajusta los valores en el objeto `initialState` según tus necesidades.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter para verificar el código

## Dependencias Principales

- Next.js: Framework de React para renderizado del lado del servidor
- React: Biblioteca para construir interfaces de usuario
- Recharts: Biblioteca para crear gráficos interactivos
- Tailwind CSS: Framework de CSS para diseño rápido y responsivo

## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contacto

Para cualquier consulta, por favor contacta a [jmarquez@10code.es](mailto:jmarquez@10code.es).
