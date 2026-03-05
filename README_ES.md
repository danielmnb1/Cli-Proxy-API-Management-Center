# Centro de Gestión de CLI Proxy API

Una interfaz web de un solo archivo (React + TypeScript) para operar y solucionar problemas de **CLI Proxy API** a través de su **API de Gestión** (configuración, credenciales, registros y uso).

[English Documentation](README.md) | [中文文档](README_CN.md)

**Proyecto Principal**: https://github.com/router-for-me/CLIProxyAPI  
**URL de Ejemplo**: https://remote.router-for.me/  
**Versión Mínima Requerida**: ≥ 6.8.0 (recomendada ≥ 6.8.15)

Desde la versión 6.0.19, la interfaz web se incluye con el programa principal; acceda a ella a través de `/management.html` en el puerto de la API una vez que el servicio esté en ejecución.

## Qué es (y qué no es)

- Este repositorio es solo la interfaz web. Se comunica con la **API de Gestión** de CLI Proxy API (`/v0/management`) para leer/actualizar la configuración, cargar credenciales, ver registros e inspeccionar el uso.
- **No** es un proxy y no reenvía tráfico.

## Inicio rápido

### Opción A: Usar la interfaz web integrada en CLI Proxy API (recomendado)

1. Inicie su servicio CLI Proxy API.
2. Abra: `http://<host>:<puerto_api>/management.html`
3. Ingrese su **clave de gestión** y conéctese.

La dirección se detecta automáticamente a partir de la URL de la página actual; se admite la anulación manual.

### Opción B: Ejecutar el servidor de desarrollo

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` y luego conéctese a su instancia de backend de CLI Proxy API.

### Opción C: Construir un único archivo HTML

```bash
npm install
npm run build
```

- Salida: `dist/index.html` (todos los activos están integrados).
- Para el empaquetado de CLI Proxy API, el flujo de trabajo de lanzamiento lo renombra a `management.html`.
- Para una vista previa local: `npm run preview`

Consejo: abrir `dist/index.html` a través de `file://` puede ser bloqueado por CORS del navegador; servirlo (servidor de vista previa/estático) es más confiable.

## Conexión al servidor

### Dirección de la API

Puede ingresar cualquiera de las siguientes; la interfaz la normalizará:

- `localhost:8317`
- `http://192.168.1.10:8317`
- `https://example.com:8317`
- `http://example.com:8317/v0/management` (también aceptado; el sufijo se elimina internamente)

### Clave de gestión (no es lo mismo que las claves de API)

La clave de gestión se envía con cada solicitud como:

- `Authorization: Bearer <MANAGEMENT_KEY>` (por defecto)

Esto es diferente de las `api-keys` del proxy que gestiona dentro de la interfaz (esas son para las solicitudes de los clientes a los puntos finales del proxy).

### Gestión remota

Si se conecta desde un navegador que no sea localhost, el servidor debe permitir la gestión remota (por ejemplo, `allow-remote-management: true`).  
Consulte `api.md` para conocer las reglas completas de autenticación, límites del lado del servidor y casos específicos.

## Qué puede gestionar (mapeado a las páginas de la interfaz)

- **Panel de Control (Dashboard)**: estado de la conexión, versión del servidor/fecha de compilación, recuentos rápidos, instantánea de disponibilidad de modelos.
- **Configuración Básica**: depuración, URL del proxy, reintento de solicitudes, fallback de cuota (cambiar de proyecto o previsualizar modelos cuando se alcanzan los límites), estadísticas de uso, registro de solicitudes, registro de archivos, autenticación WebSocket.
- **Claves de API**: gestionar las `api-keys` del proxy (añadir/editar/eliminar).
- **Proveedores de IA**:
  - Entradas de claves de Gemini/Codex/Claude/Vertex (URL base, encabezados, proxy, alias de modelos, modelos excluidos, prefijo).
  - Proveedores compatibles con OpenAI (múltiples claves de API, encabezados personalizados, importación de alias de modelos a través de `/v1/models`, prueba opcional de "chat/completions" en el lado del navegador).
  - Integración con Ampcode (URL/clave de flujo ascendente, mapeos forzados, tabla de mapeo de modelos).
- **Archivos de Autenticación**: cargar/descargar/eliminar credenciales JSON, filtrar/buscar/paginación, indicadores de solo tiempo de ejecución, ver modelos admitidos por credencial (cuando el servidor lo admite), gestionar modelos excluidos de OAuth (admite comodines `*`), configurar mapeos de alias de modelos OAuth.
- **OAuth**: iniciar flujos de OAuth/dispositivo para proveedores compatibles, sondear el estado, enviar opcionalmente la `redirect_url` de callback; incluye la importación de cookies de iFlow.
- **Gestión de Cuotas**: gestionar límites de cuota y uso para Claude, Antigravity, Codex, Gemini CLI y otros proveedores.
- **Uso**: gráficos de solicitudes/tokens (hora/día), desglose por API y por modelo, desglose de tokens en caché/razonamiento, ventana RPM/TPM, estimación de costos opcional con precios de modelos guardados localmente.
- **Configuración**: editar `/config.yaml` en el navegador con resaltado de sintaxis YAML + búsqueda, luego guardar/recargar.
- **Registros (Logs)**: seguimiento de registros con sondeo incremental, actualización automática, búsqueda, ocultar tráfico de gestión, limpiar registros; descargar archivos de registro de errores de solicitudes.
- **Sistema**: enlaces rápidos + obtener `/v1/models` (vista agrupada). Requiere al menos una clave de API de proxy para consultar los modelos.

## Pila Tecnológica

- React 19 + TypeScript 5.9
- Vite 7 (construcción en un solo archivo)
- Zustand (gestión de estado)
- Axios (cliente HTTP)
- react-router-dom v7 (HashRouter)
- Chart.js (visualización de datos)
- CodeMirror 6 (editor YAML)
- SCSS Modules (estilos)
- i18next (internacionalización)

## Internacionalización

Actualmente admite cuatro idiomas:

- Inglés (en)
- Chino Simplificado (zh-CN)
- Ruso (ru)
- Español (es)
 hize lo mejor posible para la traduccion
El idioma de la interfaz se detecta automáticamente a partir de la configuración del navegador y se puede cambiar manualmente en la parte inferior de la página.

## Compatibilidad del Navegador

- Objetivo de construcción: `ES2020`
- Admite navegadores modernos (Chrome, Firefox, Safari, Edge)
- Diseño responsivo para acceso desde móviles y tabletas

## Notas de construcción y lanzamiento

- Vite produce un **único archivo HTML** de salida (`dist/index.html`) con todos los activos integrados (a través de `vite-plugin-singlefile`).
- El etiquetado `vX.Y.Z` activa `.github/workflows/release.yml` para publicar `dist/management.html`.
- La versión de la interfaz mostrada en el pie de página se inyecta en el momento de la construcción (env `VERSION`, etiqueta git o fallback de `package.json`).

## Notas de seguridad

- La clave de gestión se almacena en el `localStorage` del navegador utilizando un formato de ofuscación ligero (`enc::v1::...`) para evitar el almacenamiento en texto plano; trátela como información sensible.
- Use un perfil de navegador o dispositivo dedicado para la gestión. Sea cauteloso al habilitar la gestión remota y evalúe su superficie de exposición.

## Solución de problemas

- **No se puede conectar / 401**: confirme la dirección de la API y la clave de gestión; el acceso remoto puede requerir habilitar la gestión remota en la configuración del servidor.
- **Fallos de autenticación repetidos**: el servidor puede bloquear temporalmente las IPs remotas.
- **Falta la página de registros**: habilite "Registro en archivo" en la Configuración Básica; el elemento de navegación se muestra solo cuando el registro en archivo está habilitado.
- **Algunas funciones muestran "no compatible"**: el backend puede ser demasiado antiguo o el punto final está deshabilitado/ausente (común para listas de modelos por archivo de autenticación, modelos excluidos, registros).
- **La prueba del proveedor OpenAI falla**: la prueba se ejecuta en el navegador y depende de la red/CORS del punto final del proveedor; un fallo aquí no siempre significa que el servidor no pueda alcanzarlo.

## Desarrollo

```bash
npm run dev        # Servidor de desarrollo Vite
npm run build      # tsc + Construcción Vite
npm run preview    # servir dist localmente
npm run lint       # ESLint (falla con advertencias)
npm run format     # Prettier
npm run type-check # tsc --noEmit
```

## Contribuciones

Los problemas (issues) y las solicitudes de extracción (PRs) son bienvenidos. Por favor, incluya:

- Pasos de reproducción (versión del servidor + versión de la interfaz)
- Capturas de pantalla para cambios en la interfaz
- Notas de verificación (`npm run lint`, `npm run type-check`)

## Licencia

MIT
