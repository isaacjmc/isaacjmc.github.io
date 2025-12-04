from flask import Flask, jsonify
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os

app = Flask(__name__)
CORS(app) # Habilitar CORS para todas las rutas


# Configuración de la API de Google Sheets
# Asegúrate de tener el archivo 'credentials.json' en la misma carpeta
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
        
        # Abre la hoja de cálculo
        # Si tu archivo se llama diferente, cambia esto: client.open("NombreDelArchivo").worksheet(SHEET_NAME)
        # Aquí asumimos que abres por nombre de archivo o usas la primera hoja si solo hay una
        # Para ser más seguro, usa el ID o el nombre exacto del archivo
        # Ejemplo: sheet = client.open("MiPortafolio").worksheet("elementos")
        
        # NOTA: Reemplaza "NombreDeTuArchivoGoogleSheets" con el nombre real de tu archivo en Drive
        sheet = client.open("infoijmc").worksheet("elementos") 
        
        # Usamos get_all_values() en lugar de get_all_records() para evitar errores
        # si hay columnas vacías (headers duplicados como '') al final de la hoja.
        rows = sheet.get_all_values()
        
        if not rows:
            return [], None
            
        # La primera fila son los encabezados
        headers = rows[0]
        data_rows = rows[1:]
        
        # DEBUG: Si no hay filas de datos, devolvemos info para depurar
        if not data_rows:
            return [], f"Se encontraron headers: {headers}, pero no hay filas de datos."

        formatted_data = []
        for row in data_rows:
            # Creamos un diccionario mapeando header -> valor, ignorando headers vacíos
            row_dict = {}
            for i, header in enumerate(headers):
                if header and i < len(row):
                    row_dict[header] = row[i]
            
            if not row_dict:
                continue

            # Mapeo usando los nombres exactos de las columnas en tu hoja
            # IMPORTANTE: Los nombres aquí (ej. 'urlImagen') deben ser IDÉNTICOS a los de tu Excel
            item = {
                "nombreP": row_dict.get('nombrep', ''),
                "urlImagen": row_dict.get('urlImagen', ''), # Corregido: urlImagen (camelCase)
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
