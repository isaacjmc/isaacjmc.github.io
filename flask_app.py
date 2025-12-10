from flask import Flask, jsonify
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os

app = Flask(__name__)
CORS(app) # Habilitar CORS para todas las rutas, para la comunicacion entre el frontend y el backend

# Asegúrate de tener el archivo 'credentials.json' en la misma carpeta y de haber habilitado la API de Google Sheets en el proyecto de Google Cloud
SCOPE = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
# Usamos ruta absoluta para evitar problemas en PythonAnywhere
CREDS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')
SHEET_NAME = 'elementos'  # El nombre de tu hoja de cálculo (o pestaña)

def get_data_from_sheets():
    try:
        if not os.path.exists(CREDS_FILE):
            return None, "Archivo credentials.json no encontrado."

        creds = ServiceAccountCredentials.from_json_keyfile_name(CREDS_FILE, SCOPE)
        client = gspread.authorize(creds)
        
        # Reemplaza "NombreDeTuArchivoGoogleSheets" con el nombre real de tu archivo en Drive, si quieres implementarlo debes cambiarlo 
        sheet = client.open("infoijmc").worksheet("elementos") 
        
        rows = sheet.get_all_values()
        
        if not rows:
            return [], None
            
        # La primera fila son los encabezados
        headers = rows[0]
        data_rows = rows[1:]
        
        # Si no hay filas de datos, devolvemos info para depurar, comprobando si se encontraron headers e informacion bajo lo mismo
        if not data_rows:
            return [], f"Se encontraron headers: {headers}, pero no hay filas de datos."

        formatted_data = []
        for row in data_rows:
            # Se crea el diccionario mapeando header de la hoja de calculo, primera fila
            row_dict = {}
            for i, header in enumerate(headers):
                if header and i < len(row):
                    row_dict[header] = row[i]
            
            if not row_dict:
                continue

            # Mapeo usando los nombres exactos de las columnas en tu hoja, los nombres aqui (ej. 'urlImagen') deben ser IDÉNTICOS a los de tu sheet
            item = {
                "nombreP": row_dict.get('nombrep', ''),
                "urlImagen": row_dict.get('urlImagen', ''),
                "descripcion": {
                    "es": row_dict.get('es', ''),
                    "en": row_dict.get('en', '')
                },
                "urlProyecto": row_dict.get('urlProyecto', ''),
                "tipo": row_dict.get('tipo', '')
            }
            formatted_data.append(item)
            
        if not formatted_data:
            return [], f"Se procesaron {len(data_rows)} filas pero el resultado está vacío. Headers encontrados: {headers}. Ejemplo de fila cruda: {data_rows[0] if data_rows else 'Ninguna'}"

        return formatted_data, None
    except Exception as e:
        return None, str(e)

@app.route('/')
def home():
    return "API funcionando. Ve a /api/proyectos para ver los datos."

@app.route('/api/proyectos', methods=['GET'])
def get_proyectos():
    data, error = get_data_from_sheets()
    
    if error:
        return jsonify({"error": error}), 500
        
    return jsonify({"elementos": data})

if __name__ == '__main__':
    app.run(debug=True)
