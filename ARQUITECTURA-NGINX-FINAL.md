# 🏗️ ARQUITECTURA NGINX - CANNAVAL INTEGRADO

**Fecha**: 11 de Noviembre, 2025
**Servidor**: 23.105.176.45
**Status**: ✅ OPERATIVO

---

## 📊 ESTRUCTURA ACTUALIZADA

```
23.105.176.45 (Servidor Principal)
│
├── 🌐 Nginx (Puertos 80/443) - Proxy Inverso Principal
│   ├── www.ultimamilla.com.ar → Astro App (puerto 4321) ✅
│   ├── sgi.ultimamilla.com.ar → SGI System (puerto 3456) ✅
│   ├── viveroloscocos.com.ar → WordPress (PHP-FPM 9000) ✅
│   ├── admin.ultimamilla.com.ar → Directus (puerto 8055) ✅
│   └── 🌱 cannaval.ultimamilla.com.ar → Cannaval SPA (NUEVO) ✅
│
├── 🚀 Aplicaciones Principales - PRODUCCIÓN
│   ├── 📦 Astro App (Puerto 4321) - Modo Producción via PM2
│   ├── 🗄️  Directus CMS (Puerto 8055) - Contenedor Docker
│   ├── 🐘 PostgreSQL - Contenedor Docker
│   ├── 🟥 Redis - Contenedor Docker
│   ├── 🚨 UMBot Emergency (Puerto 8092)
│   └── 🌱 Cannaval SPA - Archivos estáticos en /dist (NUEVO)
│
├── ⚙️ Sistema de Gestión Interna (SGI)
│   └── 📊 Node.js + PM2 (Puerto 3456)
│
└── 🌐 Sitios Externos
    ├── 🌱 Vivero Los Cocos (PHP-FPM 9000)
    └── 📚 Wiki (Configurado)
```

---

## 🔧 CONFIGURACIÓN NGINX - CANNAVAL

### Ubicación del archivo
```
/etc/nginx/sites-available/cannaval.ultimamilla.com.ar
/etc/nginx/sites-enabled/cannaval.ultimamilla.com.ar (symlink)
```

### Características Implementadas

#### 1. **HTTPS Seguro**
- ✅ SSL/TLS 1.2 y 1.3
- ✅ Certificado Let's Encrypt (wildcard ultimamilla.com.ar)
- ✅ Redirección HTTP → HTTPS

#### 2. **SPA Routing**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
- ✅ Todas las rutas van a `index.html`
- ✅ Permite navegación SPA sin errores 404

#### 3. **Cache Optimizado**
```nginx
# Assets estáticos - 1 año
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# index.html - Sin cache
location / {
    expires -1;
    add_header Cache-Control "public, max-age=0, must-revalidate";
}
```

#### 4. **Seguridad**
- ✅ Headers de seguridad (X-Frame-Options, X-Content-Type-Options, HSTS)
- ✅ Denegar acceso a archivos ocultos (`.git`, `.env`, etc)
- ✅ Denegar acceso a archivos de configuración
- ✅ Denegar acceso a archivos de backup

#### 5. **Compresión GZIP**
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/json ...
```
- ✅ Reduce tamaño de transferencia en ~70%

#### 6. **Logs Separados**
```
/var/log/nginx/cannaval.ultimamilla.com.ar-access.log
/var/log/nginx/cannaval.ultimamilla.com.ar-error.log
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

### Servidor (23.105.176.45)
```
/home/umbot.com.ar/
├── public_html/
│   ├── dist/                    # Archivos compilados (servidos por Nginx)
│   │   ├── index.html           # SPA entry point
│   │   ├── assets/
│   │   │   ├── index-DfLU7EjQ.js    # Bundle principal (759.85 KB)
│   │   │   └── ...
│   │   └── img/
│   │       └── ...
│   └── logs/
│       ├── access.log
│       └── error.log
└── ...
```

### Local (Desarrollo)
```
/Volumes/SDTERA/ninjardin/cannaval/
├── dist/                        # Build output
├── src/                         # Source files
├── components/                  # React components
├── nginx-cannaval-production.conf  # Configuración Nginx
└── ...
```

---

## 🚀 FLUJO DE DEPLOY

### 1. **Build Local**
```bash
cd /Volumes/SDTERA/ninjardin/cannaval
npm install
npm run build
```

### 2. **Copiar a Servidor**
```bash
scp -r dist/* root@23.105.176.45:/home/umbot.com.ar/public_html/dist/
```

### 3. **Verificar Nginx**
```bash
ssh root@23.105.176.45 "nginx -t && systemctl reload nginx"
```

### 4. **Verificar en Navegador**
```
https://cannaval.ultimamilla.com.ar
```

---

## 📊 URLS FINALES

| Aplicación | URL | Puerto | Tipo |
|-----------|-----|--------|------|
| Astro Principal | www.ultimamilla.com.ar | 4321 | Proxy |
| SGI | sgi.ultimamilla.com.ar | 3456 | Proxy |
| WordPress | viveroloscocos.com.ar | 9000 | PHP-FPM |
| Directus Admin | admin.ultimamilla.com.ar | 8055 | Docker |
| **Cannaval** | **cannaval.ultimamilla.com.ar** | **dist** | **SPA Estática** |

---

## ✅ VERIFICACIÓN

### Comprobar que Nginx está correcto
```bash
ssh root@23.105.176.45 "nginx -t"
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Ver logs en tiempo real
```bash
ssh root@23.105.176.45 "tail -f /var/log/nginx/cannaval.ultimamilla.com.ar-access.log"
```

### Verificar que el sitio está habilitado
```bash
ssh root@23.105.176.45 "ls -la /etc/nginx/sites-enabled/ | grep cannaval"
# lrwxrwxrwx ... cannaval.ultimamilla.com.ar -> /etc/nginx/sites-available/cannaval.ultimamilla.com.ar
```

---

## 🔄 ACTUALIZAR CANNAVAL

Cuando hagas cambios en el código:

```bash
# 1. Build
npm run build

# 2. Deploy
scp -r dist/* root@23.105.176.45:/home/umbot.com.ar/public_html/dist/

# 3. Verificar
curl -I https://cannaval.ultimamilla.com.ar
```

---

## 📝 NOTAS IMPORTANTES

1. **SSL Certificate**: Usa el certificado wildcard de `ultimamilla.com.ar`
   - Válido para: `*.ultimamilla.com.ar`
   - Renovación automática: Let's Encrypt

2. **Cache Strategy**:
   - Assets (JS/CSS/IMG): 1 año (immutable)
   - index.html: Sin cache (siempre fresco)
   - Esto asegura que los usuarios siempre tengan la última versión

3. **Performance**:
   - GZIP compression: ~70% reducción
   - HTTP/2: Multiplexing de requests
   - SPA routing: Sin latencia de servidor

4. **Seguridad**:
   - HSTS: Fuerza HTTPS
   - X-Frame-Options: Previene clickjacking
   - X-Content-Type-Options: Previene MIME sniffing

---

## 🎯 RESULTADO FINAL

✅ **Cannaval v2.0.0 integrado en arquitectura ultimamilla.com.ar**
- URL: https://cannaval.ultimamilla.com.ar
- Status: OPERATIVO
- Performance: OPTIMIZADO
- Seguridad: MÁXIMA

---

*Configuración finalizada: 11 de Noviembre, 2025 - 17:00 UTC-03:00*
