# Portfolio — Valentina Visciglio

Sitio estático (HTML/CSS/JS vanilla, sin build). Listo para GitHub Pages.

## Estructura
- `index.html` — home (hero interactivo, trabajo, capacidades, contacto)
- `caso-fiscalizacion.html` — plantilla de caso de estudio (proyecto 01)
- `styles.css` — estilos compartidos por todas las páginas
- `script.js` — interacciones compartidas (canvas, cursor, reveals, etc.)
- `assets/`
  - `favicon.svg` — favicon (monograma)
  - `og-image.png` — imagen de previsualización al compartir (1200×630)
  - `cv.pdf` — CV con la identidad del porfolio (generado desde su CV; reemplazable por su versión preferida). El botón "CV ↓" lo enlaza.

## Pendientes de contenido (reemplazar antes de publicar)
1. **Capturas reales** en `index.html` (las maquetas hi-fi de cada proyecto) y en
   `caso-fiscalizacion.html` (los bloques `.imgslot` marcados "reemplazar").
2. **Métricas** del caso (`.case-metric` con valor "—") con datos reales.
4. Duplicar `caso-fiscalizacion.html` para los otros proyectos cuando estén listos
   (hoy P2–P4 dicen "Caso en preparación").

## Deploy en GitHub Pages
1. Crear repo (ej. `portfolio`) y subir estos archivos a la raíz.
2. Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
3. Dominio: el archivo `CNAME` ya apunta a `valentinavisciglio.com.ar`.
   En el panel DNS del dominio, crear los registros A del apex hacia las IPs de
   GitHub Pages (185.199.108–111.153) y un CNAME `www` → `usuario.github.io`.
4. Activar "Enforce HTTPS" una vez propagado el DNS.
