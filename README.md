# Mi Portfolio

Este proyecto es un portfolio personal que incluye un panel administrativo para gestionar proyectos de manera dinámica. Utiliza Netlify CMS para facilitar la adición y edición de proyectos sin necesidad de modificar el código directamente.

## Estructura del Proyecto

- **admin/**: Contiene los archivos necesarios para el panel administrativo de Netlify CMS.
  - **config.yml**: Configuración del backend y colecciones de contenido.
  - **index.html**: Punto de entrada para el panel administrativo.

- **assets/**: Carpeta destinada a almacenar imágenes subidas a través de Netlify CMS.
  - **images/**: Imágenes subidas.

- **css/**: Contiene estilos personalizados para el portfolio.
  - **estilos.css**: Estilos adicionales más allá de Bootstrap.

- **data/**: Almacena los datos de los proyectos en formato JSON.
  - **projects.json**: Datos estructurados de los proyectos.

- **img/**: Carpeta que contiene imágenes utilizadas en el portfolio.
  - **34799.gif**: Archivo de imagen.
  - **background.jpg**: Imagen de fondo para el portfolio.
  - **logoprog.jpg**: Imagen de logo para el portfolio.

- **js/**: Contiene scripts para manejar animaciones y cargar datos de proyectos.
  - **scripts.js**: Scripts para la funcionalidad del portfolio.

- **index.html**: Archivo HTML principal que estructura la página de inicio, incluyendo secciones para "Inicio," "Proyectos," "Sobre mí," y "Contacto."

- **proyectos.html**: Archivo HTML dedicado a mostrar los proyectos, que se poblarán dinámicamente desde el archivo projects.json.

## Instrucciones de Configuración

1. **Clonar el Repositorio**: Clona este repositorio en tu máquina local.
   
   ```
   git clone <URL-del-repositorio>
   ```

2. **Instalar Dependencias**: Asegúrate de tener Node.js y npm instalados. Luego, instala las dependencias necesarias.

3. **Configurar Netlify CMS**: Accede al panel administrativo en `/admin` para gestionar tus proyectos.

4. **Desplegar el Proyecto**: Puedes desplegar el proyecto en Netlify para que sea accesible públicamente.

## Uso

- Accede al panel administrativo en `/admin` para añadir, editar o eliminar proyectos.
- Los proyectos se mostrarán automáticamente en la sección "Proyectos" de tu portfolio.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.