
## Información

### Estructura de Datos
Dentro del directorio `data` se encuentra el archivo `users.json`, que contiene la lista de usuarios que se leen para verificar su existencia en la base de datos.

### Configuración del Archivo .env
El archivo `.env` debe estar ubicado en el directorio raíz del proyecto y debe contener las siguientes variables de entorno:

```sh
API_URL=http://nonexistentapi.com/
TIMEOUT=5000
```

---

## Ejecución
Para ejecutar la rutina, usa el siguiente `comando`:
```bash
npm run check
```


---

## Notas adicionales
- Asegúrate de que el archivo .env esté correctamente configurado en el directorio raíz del proyecto.
- Verifica que el archivo users.json en el directorio data contenga la lista de usuarios que deseas verificar.