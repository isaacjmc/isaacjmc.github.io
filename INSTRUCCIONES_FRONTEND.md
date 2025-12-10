# Instrucciones para Desplegar Frontend en GitHub Pages

Sigue estos pasos para subir tu código frontend a GitHub y publicarlo usando GitHub Pages.

## 1. Prerrequisitos

1.  Tener una cuenta en [GitHub](https://github.com/).
2.  Tener **Git** instalado en tu computadora.

## 2. Crear el Repositorio en GitHub

1.  Ve a GitHub y haz clic en el botón **New** (o Nuevo repositorio).
2.  Ponle un nombre al repositorio.
    *   **Recomendado**: Si llamas al repositorio `tuusuario.github.io` (reemplazando `tuusuario` por tu nombre de usuario real), tu página web tendrá esa dirección exacta (ej. `https://isaacjmc.github.io`).
    *   Si le pones otro nombre (ej. `portafolio`), tu dirección será `https://tuusuario.github.io/portafolio`.
3.  Déjalo como **Público**.
4.  No marques "Initialize with README" si ya tienes los archivos listos en tu computadora.
5.  Haz clic en **Create repository**.

## 3. Subir tus Archivos

Sigue estos pasos si ya tienes la carpeta con tu proyecto (`index.html`, `css/`, `js/`, etc.) en tu computadora:

1.  Abre una terminal (o Git Bash) dentro de la carpeta de tu proyecto.
2.  Inicializa el repositorio (si no lo has hecho antes):
    ```bash
    git init
    ```
3.  Conecta tu carpeta local con el repositorio de GitHub (reemplaza `TU_USUARIO` y `NOMBRE_DEL_REPO` con tus datos):
    ```bash
    git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
    ```
    *(Puedes copiar este comando exacto desde la página de GitHub después de crear el repo)*.
4.  Prepara y sube tus archivos:
    ```bash
    git add .
    git commit -m "Subida inicial del portafolio"
    git branch -M main
    git push -u origin main
    ```

## 4. Activar GitHub Pages

1.  Ve a la pestaña **Settings** (Configuración) de tu repositorio en GitHub.
2.  En el menú lateral izquierdo, busca la sección **Pages** (a veces está dentro de "Code and automation").
3.  En **Source**, selecciona **Deploy from a branch**.
4.  En **Branch**, selecciona la rama **main** y asegúrate que la carpeta sea **/(root)**.
5.  Haz clic en **Save**.

## 5. Verificar

1.  Espera unos minutos. GitHub te mostrará un mensaje en la parte superior de esa misma página con el enlace a tu sitio.
2.  Haz clic en el enlace (ej. `https://isaacjmc.github.io/`).
3.  ¡Tu frontend ya debería estar visible para todo el mundo!

---

### Notas Importantes y Solución de Problemas

*   **Caché**: A veces los cambios tardan unos minutos en reflejarse. Si acabas de subir algo y no se ve, espera 2-3 minutos y prueba abrir la página en **Modo Incógnito** o presiona `Ctrl + F5` para forzar la recarga.
*   **Error 404**: Si ves un error 404, asegúrate de que tu archivo principal se llame exactamente `index.html` (todo en minúsculas).
*   **Conexión con Backend**: Recuerda que este frontend intentará conectarse a tu backend. Asegúrate de que en tu archivo `js/script.js`, la URL de la API apunte a tu servidor real (ej. `https://isaacjm.pythonanywhere.com/api/proyectos`) y no a `localhost`.
