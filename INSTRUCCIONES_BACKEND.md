# Instrucciones para Desplegar Backend en PythonAnywhere

Sigue estos pasos para configurar tu servidor en PythonAnywhere y conectar tu hoja de Google Sheets.

## 1. Configurar Google Cloud y Obtener Credenciales

Para que el script pueda leer tu Google Sheet, necesitas una "Cuenta de Servicio".

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un **Nuevo Proyecto** (ej. "PortafolioAPI").
3.  En el menú lateral, ve a **APIs y Servicios > Biblioteca**.
4.  Busca y habilita estas dos APIs:
    *   **Google Sheets API**
    *   **Google Drive API**
5.  Ve a **APIs y Servicios > Credenciales**.
6.  Haz clic en **Crear Credenciales** > **Cuenta de servicio**.
7.  Ponle un nombre y dale a "Crear y continuar" (puedes saltar los pasos opcionales).
8.  Una vez creada, haz clic en el email de la cuenta de servicio (ej. `algo@proyecto.iam.gserviceaccount.com`).
9.  Ve a la pestaña **Claves** > **Agregar clave** > **Crear nueva clave** > **JSON**.
10. Se descargará un archivo `.json`. **Renómbralo a `credentials.json`**.

## 2. Compartir la Hoja de Cálculo

1.  Abre tu archivo de Google Sheets (`infoijmc`).
2.  Haz clic en el botón **Compartir**.
3.  En el campo de agregar personas, pega el **email de la cuenta de servicio** (el que se veía en el paso 1.8, ej. `algo@proyecto.iam.gserviceaccount.com`).
4.  Dale permisos de **Editor** (o Lector es suficiente) y comparte.

## 3. Configurar PythonAnywhere

1.  Crea una cuenta en [PythonAnywhere](https://www.pythonanywhere.com/) (la cuenta gratuita "Beginner" sirve).
2.  Ve a la pestaña **Web** y haz clic en **Add a new web app**.
3.  Sigue el asistente:
    *   Tu dominio: (déjalo como está).
    *   Framework: **Flask**.
    *   Python version: **Toma nota de la versión que elijas aquí (ej. 3.10)**.
    *   Path: Déjalo por defecto (ej. `/home/tuusuario/mysite/flask_app.py`).

## 4. Subir Archivos

1.  Ve a la pestaña **Files** en PythonAnywhere.
2.  Navega a la carpeta de tu proyecto (probablemente `/home/tuusuario/mysite/`).
3.  Borra el `flask_app.py` que se creó por defecto.
4.  Sube **tu** archivo `flask_app.py` (el que te he dado).
5.  Sube tu archivo `credentials.json`.

## 5. Instalar Librerías (CORREGIDO)

Este es el paso donde suele ocurrir el error `ModuleNotFoundError`. Debes instalar las librerías para la **misma versión de Python** que elegiste en el paso 3.

1.  Ve a la pestaña **Consoles** y abre una **Bash** console.
2.  Ejecuta el siguiente comando (asegúrate de cambiar `3.10` por tu versión si es diferente):

    ```bash
    pip3.10 install --user flask flask-cors gspread oauth2client
    ```
    *(Si elegiste Python 3.9, usa `pip3.9`, etc.)*

## 6. Configurar WSGI (Importante)

1.  Ve a la pestaña **Web**.
2.  Busca la sección "Code" y haz clic en el enlace del **WSGI configuration file** (ej. `/var/www/tuusuario_pythonanywhere_com_wsgi.py`).
3.  Se abrirá un editor. Asegúrate de que el contenido apunte a tu archivo. Debería verse algo así (ajusta `project_home` si es necesario, pero por defecto suele estar bien):

    ```python
    import sys
    import os

    # path to your project
    path = '/home/TU_USUARIO/mysite'
    if path not in sys.path:
        sys.path.append(path)

    from flask_app import app as application  # Importa 'app' desde 'flask_app.py'
    ```

4.  Guarda el archivo (Save).

## 7. Recargar y Probar

1.  Vuelve a la pestaña **Web**.
2.  Haz clic en el botón verde **Reload**.
3.  Abre la URL de tu sitio (ej. `https://tuusuario.pythonanywhere.com/api/proyectos`).
4.  ¡Deberías ver tus datos en formato JSON!

