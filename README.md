# Power Milk — Empaquetado para Android

Este repositorio contiene la versión web de Power Milk. Aquí tienes los pasos para preparar la app y llevarla a Android (usando Capacitor, recomendado) o empaquetarla manualmente con WebView.

---

## Requisitos (Windows)
- Node.js (>=16)
- npm (incluido con Node)
- Java JDK (OpenJDK 11 o 17 recomendado)
- Android Studio con SDK y herramientas instaladas
- (Opcional) Python si usas el servidor de desarrollo alternativo

---

## Preparar el repositorio
1. Abre PowerShell y sitúate en la carpeta del proyecto:
```powershell
cd 'C:\Users\Windows\Desktop\sistema de power Milk'
```
2. Instala dependencias de desarrollo (Capacitor CLI/Core):
```powershell
npm install
# si no quieres instalar todo, puedes instalar solo Capacitor:
# npm install @capacitor/core @capacitor/cli --save-dev
```

Nota: `package.json` contiene scripts útiles para Capacitor (cap:init, cap:copy, cap:add-android, cap:open-android, cap:sync).

---

## Opción recomendada: Capacitor (pasos)
1. Inicializa Capacitor (solo si no lo has hecho):
```powershell
npx cap init "Power Milk" com.tuempresa.powermilk --web-dir=.
```
- Cambia `com.tuempresa.powermilk` por tu identificador de paquete.

2. Copia los assets web al proyecto nativo:
```powershell
npx cap copy
```

3. Añade la plataforma Android (una sola vez):
```powershell
npx cap add android
```

4. Abre el proyecto Android en Android Studio:
```powershell
npx cap open android
```
- En Android Studio: selecciona un emulador o dispositivo y ejecuta la app.

5. Después de cada cambio en la web, ejecuta:
```powershell
npx cap copy android
npx cap sync android
```
- Luego recompila desde Android Studio.

6. Generar bundle firmado (AAB) para Play Store:
- En Android Studio: Build → Generate Signed Bundle / APK → sigue el asistente.

---

## Opción alternativa: WebView manual
1. En Android Studio crea un proyecto nuevo (Empty Activity).
2. Copia los archivos web a `app/src/main/assets/www/`.
3. En `MainActivity` carga:
```kotlin
webView.loadUrl("file:///android_asset/www/index.html")
```
4. Habilita JavaScript y DOM storage para que `localStorage` funcione.

---

## Notas y recomendaciones
- Asegúrate de usar rutas relativas en `index.html` (por ejemplo `script.js`, `styles.css`). Ya están configuradas así en este repo.
- LocalStorage e IndexedDB funcionan dentro del WebView. Capacitor usa `capacitor://localhost` y gestiona bien estos casos.
- Si guardas imágenes grandes en Base64 en `localStorage`, considera optimizar/comprimir antes de guardar.
- Para permisos nativos o funcionalidades (cámara, archivos, notificaciones), instala plugins de Capacitor y sigue la documentación oficial.

---

## Troubleshooting rápido
- Si Android Studio no detecta el proyecto: asegúrate de haber ejecutado `npx cap add android` y de abrir la carpeta `android` creada por Capacitor.
- Errores de CORS/API: en un WebView el origen puede ser `file://` o `capacitor://localhost`. Ajusta CORS en tu API o usa un proxy.
- Si `npx cap init` solicita un `webDir`, usa `.` si tus archivos web están en la raíz (como en este repo).

---

Si quieres, puedo ejecutar aquí los pasos que impliquen modificar archivos (ya preparé `capacitor.config.json` y añadí scripts a `package.json`), o puedo generar el proyecto Android (WebView) y copiar los assets dentro del repo para que lo abras directamente en Android Studio. Dime cuál prefieres (Capacitor o WebView manual).