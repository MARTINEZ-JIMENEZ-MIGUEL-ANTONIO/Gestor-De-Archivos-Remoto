# Gestor De Archivos Remoto.

## Introducción
Una empresa de TI busca mejorar la eficiencia en el intercambio de
archivos y la colaboración entre sus empleados dispersos
geográficamente. Para lograrlo, se propone implementar un Gestor
de Archivos Remoto en la Nube mediante una arquitectura
Cliente/Servidor. El Cliente proporciona una interfaz intuitiva para
interactuar con el sistema, mientras que el Servidor se encarga de
gestionar las operaciones de archivos y la base de datos asociada. Se
emplearán tecnologías como React.js, Node.js, Express.js y MySQL
para su desarrollo, asegurando así un sistema confiable y escalable.

### Problemática:
Una empresa de TI quiere implementar un Gestor de
Archivos Remoto para facilitar el acceso y la colaboración
entre empleados ubicados en diferentes lugares. Esto puede
mejorar la eficiencia en el intercambio de archivos, la gestión de
documentos y la colaboración en proyectos.


### Objetivo:
Desarrollar un `Gestor de Archivos Remoto' que permita mejorar la eficiencia en el intercambio de
archivos, la gestión de documentos y la colaboración en proyectos
para una empresa de TI.

## Cliente

### Interfaz de Usuario (UI): Proporciona la interfaz gráfica para que
los usuarios interactúen con el gestor de archivos.
#### Modo de Usuario:
▪ Autenticación y autorización.
▪ Perfiles de usuario para personalizar la experiencia.
▪ Registro de actividad para seguimiento y auditoría.
#### Modo de Categoría:
▪ Organización de archivos en categorías o carpetas.
▪ Etiquetado para categorizar archivos según diferentes criterios.
▪ Búsqueda y filtrado para encontrar archivos rápidamente.
#### Modo de Archivo:
▪ Vista previa de archivos sin descargarlos.
▪ Compartir archivos con otros usuarios.
▪ Versionado de archivos para mantener un historial de cambios.
### Módulo de Gestión de Archivos: Facilita la interacción del usuario
con los archivos, incluyendo operaciones como subir, descargar,
renombrar y eliminar archivos.

## Servidor:
### Servicio de Gestión de Archivos: 
Maneja las operaciones de archivos, como subida, descarga, renombrado y eliminación.
### Base de Datos: 
Almacena metadatos relacionados con los archivos, como nombres, tamaños y fechas de creación/modificación.


1. *Operaciones de Archivos:*
   - El usuario interactúa con la interfaz del cliente para realizar operaciones en los archivos.
   - El cliente envía solicitudes al servidor para llevar a cabo las operaciones seleccionadas.
   - El servidor gestiona las operaciones, actualiza la base de datos y realiza las acciones necesarias en el almacenamiento en la nube.

2. *Seguridad:*
   - Las comunicaciones entre cliente y servidor están cifradas mediante SSL/TLS.
   - Control de acceso basado en roles para garantizar la privacidad y seguridad de los archivos.

3. *Almacenamiento en la Nube:*
   - Utilización de servicios de almacenamiento en la nube para redundancia, escalabilidad y disponibilidad.
   - Implementación de políticas de retención y versionado para la gestión efectiva de archivos.

## Tecnologías Recomendadas
- *Framework:*
  - React.js.
- *Interfaz de Usuario:*
  - HTML5, CSS3, JavaScript.

- *Servidor:*
  - Node.js, Express.js.

- *Almacenamiento de Datos:*
  - MySQL (XAMPP).

- *Gestión de Archivos:*
  - Express.js.

## Integrantes del Equipo
- Aguilar Medina Francisco Antonio
- Martinez Jimenez Miguel Antonio
- Rubio Antonio Janny Lizbeth
- Yeh Hernandez Kevin Alejandro


## Configuración y Despliegue

1. *Clonar el Repositorio:*
   ```bash
   git clone https://github.com/MARTINEZ-JIMENEZ-MIGUEL-ANTONIO/Gestor-De-Archivos-Remoto.git
