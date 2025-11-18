# ✅ CONFIGURACIÓN FINAL - CANNAVAL v2.0.0 CON HTTPS

**Fecha**: 11 de Noviembre, 2025 - 17:05 UTC-03:00
**Servidor**: 23.105.176.45
**Dominio**: www.umbot.com.ar
**Protocolo**: HTTPS (TLS 1.2/1.3)
**Status**: ✅ OPERATIVO

---

## 🌐 URL FINAL

```
https://www.umbot.com.ar
```

---

## 🔧 CONFIGURACIÓN NGINX

### Ubicación
```
/etc/nginx/sites-available/umbot.com.ar
/etc/nginx/sites-enabled/umbot.com.ar (symlink)
```

### Características Implementadas

#### 1. **HTTPS Seguro**
```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/umbot.com.ar/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/umbot.com.ar/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
```
- ✅ SSL/TLS 1.2 y 1.3
- ✅ Certificado Let's Encrypt válido
- ✅ HTTP/2 habilitado

#### 2. **Redirección HTTP → HTTPS**
```nginx
server {
    listen 80;
    server_name umbot.com.ar www.umbot.com.ar;
    return 301 https://$server_name$request_uri;
}
```
- ✅ Todas las conexiones HTTP redirigen a HTTPS

#### 3. **SPA Routing**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
- ✅ Todas las rutas van a `index.html`
- ✅ Navegación SPA sin errores 404

#### 4. **Cache Optimizado**
```nginx
# Assets - 1 año
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
- ✅ Assets estáticos: 1 año (immutable)
- ✅ index.html: Sin cache (siempre fresco)

#### 5. **Seguridad**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```
- ✅ HSTS: Fuerza HTTPS
- ✅ X-Frame-Options: Previene clickjacking
- ✅ X-Content-Type-Options: Previene MIME sniffing
- ✅ X-XSS-Protection: Protección XSS

#### 6. **Compresión GZIP**
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/json ...
```
- ✅ Reduce tamaño de transferencia ~70%
- ✅ Mejora performance

#### 7. **Logs**
```
/home/umbot.com.ar/logs/access.log
/home/umbot.com.ar/logs/error.log
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

---

## 🚀 FLUJO DE DEPLOY

### 1. Build Local
```bash
cd /Volumes/SDTERA/ninjardin/cannaval
npm install
npm run build
```

### 2. Deploy a Servidor
```bash
scp -r dist/* root@23.105.176.45:/home/umbot.com.ar/public_html/dist/
```

### 3. Verificar Nginx
```bash
ssh root@23.105.176.45 "nginx -t && systemctl reload nginx"
```

### 4. Verificar en Navegador
```
https://www.umbot.com.ar
```

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
ssh root@23.105.176.45 "tail -f /home/umbot.com.ar/logs/access.log"
```

### Verificar HTTPS
```bash
curl -I https://www.umbot.com.ar
# HTTP/2 200
# strict-transport-security: max-age=31536000; includeSubDomains
# x-frame-options: SAMEORIGIN
```

### Verificar que el sitio está habilitado
```bash
ssh root@23.105.176.45 "ls -la /etc/nginx/sites-enabled/ | grep umbot"
# lrwxrwxrwx ... umbot.com.ar -> /etc/nginx/sites-available/umbot.com.ar
```

---

## 📊 MÉTRICAS

| Métrica | Valor |
|---------|-------|
| **URL** | https://www.umbot.com.ar |
| **Protocolo** | HTTPS (TLS 1.2/1.3) |
| **Certificado** | Let's Encrypt (umbot.com.ar) |
| **Bundle JS** | 759.85 KB (gzip: 223.27 KB) |
| **Compresión GZIP** | ~70% reducción |
| **Cache Assets** | 1 año (immutable) |
| **Cache index.html** | Sin cache |
| **HTTP/2** | ✅ Habilitado |
| **HSTS** | ✅ Habilitado |

---

## 🔄 ACTUALIZAR CANNAVAL

Cuando hagas cambios en el código:

```bash
# 1. Build
npm run build

# 2. Deploy
scp -r dist/* root@23.105.176.45:/home/umbot.com.ar/public_html/dist/

# 3. Verificar (opcional)
curl -I https://www.umbot.com.ar
```

---

## 📝 NOTAS IMPORTANTES

1. **SSL Certificate**
   - Dominio: umbot.com.ar
   - Renovación automática: Let's Encrypt
   - Válido para: umbot.com.ar y www.umbot.com.ar

2. **Cache Strategy**
   - Assets (JS/CSS/IMG): 1 año (immutable)
   - index.html: Sin cache (siempre fresco)
   - Esto asegura que los usuarios siempre tengan la última versión

3. **Performance**
   - GZIP compression: ~70% reducción
   - HTTP/2: Multiplexing de requests
   - SPA routing: Sin latencia de servidor

4. **Seguridad**
   - HSTS: Fuerza HTTPS en futuras visitas
   - X-Frame-Options: Previene clickjacking
   - X-Content-Type-Options: Previene MIME sniffing
   - Denegar acceso a archivos ocultos y configuración

---

## 🎯 RESULTADO FINAL

✅ **Cannaval v2.0.0 completamente funcional en producción**

- **URL**: https://www.umbot.com.ar
- **Protocolo**: HTTPS (TLS 1.2/1.3)
- **Status**: OPERATIVO
- **Performance**: OPTIMIZADO
- **Seguridad**: MÁXIMA

---

*Configuración finalizada: 11 de Noviembre, 2025 - 17:05 UTC-03:00*
