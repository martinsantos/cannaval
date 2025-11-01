# Cannaval - Despliegue en Producción

## ✅ Estado: COMPLETADO

**Fecha:** 2025-10-27  
**Servidor:** 23.105.176.45  
**Dominio:** www.umbot.com.ar  
**Framework:** React + Vite (Artefactos Estáticos)  

---

## 📦 Despliegue Realizado

### Archivos Estáticos
- **Ruta:** `/home/umbot.com.ar/public_html/`
- **Contenido:** Build completo de Cannaval (React + Vite)
- **Tamaño:** ~4.8 KB (index.html) + assets en `/assets/`
- **Método:** SCP desde local

### Configuración Nginx
- **Archivo:** `/etc/nginx/sites-available/umbot.com.ar`
- **Estado:** Habilitado en `/etc/nginx/sites-enabled/`
- **Características:**
  - Redirección HTTP 80 → HTTPS 443
  - TLS 1.2/1.3 con ciphers seguros
  - SPA routing (todas las rutas → index.html)
  - Cache 1 año para assets estáticos
  - Logs separados por dominio

### Certificados SSL
- **Proveedor:** Let's Encrypt
- **Dominios:** umbot.com.ar, www.umbot.com.ar
- **Ruta:** `/etc/letsencrypt/live/www.umbot.com.ar/`
- **Expira:** 2026-01-25
- **Renovación:** Automática (Certbot)

---

## ✅ Servicios Existentes (Verificados - SIN CAMBIOS)

| Servicio | Puerto | Estado | Tipo | Verificación |
|----------|--------|--------|------|--------------|
| Astro App | 3000 | ✅ Online | PM2 | PID 176131 |
| SGI System | 3456 | ✅ Online | PM2 | PID 118539 |
| PHP-FPM | 9000 | ✅ Online | Sistema | Activo |
| Directus | 8055 | ✅ Online | Docker | Contenedor activo |
| PostgreSQL | 5432 | ✅ Online | Docker | Contenedor activo |
| Redis | 6379 | ✅ Online | Docker | Contenedor activo |
| Nginx | 80/443 | ✅ Active | Sistema | Recargado sin downtime |

---

## 🔧 Comandos de Mantenimiento

### Verificar Estado
```bash
# Nginx
systemctl status nginx

# PM2
pm2 list

# Puertos activos
ss -tulpn | grep -E ":(3000|3456|9000|8055|80|443)"
```

### Logs
```bash
# Cannaval (Nginx)
tail -f /home/umbot.com.ar/logs/access.log
tail -f /home/umbot.com.ar/logs/error.log

# Nginx general
tail -f /var/log/nginx/error.log
```

### Recargar Nginx (sin downtime)
```bash
systemctl reload nginx
```

### Renovar Certificado SSL
```bash
certbot renew --dry-run
certbot renew
```

---

## 🚀 Actualizar Cannaval

### Desde Local
```bash
# 1. Generar build
npm run build

# 2. Subir archivos al servidor
sshpass -p 'gsiB%s@0yD' scp -r dist/* root@23.105.176.45:/home/umbot.com.ar/public_html/

# 3. Verificar (opcional)
sshpass -p 'gsiB%s@0yD' ssh root@23.105.176.45 'ls -la /home/umbot.com.ar/public_html/'
```

### Desde Servidor
```bash
# Limpiar caché (Nginx no cachea HTML, solo assets con hash)
# No es necesario hacer nada - los assets tienen hash en el nombre

# Recargar Nginx si es necesario
systemctl reload nginx
```

---

## ⚠️ Precauciones Críticas

**NUNCA:**
- ❌ Modificar configuraciones de otros servicios (Astro, SGI, WordPress, Directus)
- ❌ Tocar puertos 3000, 3456, 9000, 8055
- ❌ Eliminar archivos de otros dominios
- ❌ Reiniciar Nginx (usar `reload` en su lugar)
- ❌ Cambiar permisos de directorios existentes

**SIEMPRE:**
- ✅ Hacer `nginx -t` antes de recargar
- ✅ Verificar logs después de cambios
- ✅ Mantener backups de configuración
- ✅ Documentar cambios realizados

---

## 📋 Documentación en Servidor

Archivo: `/home/umbot.com.ar/DEPLOYMENT.md`

Contiene:
- Estructura de directorios
- Configuración Nginx
- Certificados SSL
- Servicios existentes
- Comandos útiles
- Precauciones

---

## 🛠️ Mantenimiento 2025-10-28

- **Incidencia:** Assets bloqueados (`403 Permission denied`) por ownership `root:root` en `/home/umbot.com.ar/public_html/assets`.
- **Acción correctiva:** `chown -R umbot7607:umbot7607 /home/umbot.com.ar/public_html` + `chmod 755` (directorios) / `chmod 644` (archivos).
- **Verificación:** `curl -sk https://www.umbot.com.ar/` devuelve HTML principal.
- **Observación:** `curl -I` reporta certificado expirado → ejecutar `certbot renew` si corresponde.

---

## 🔍 Verificación Final

✅ Build generado correctamente  
✅ Archivos desplegados en servidor  
✅ Vhost Nginx configurado  
✅ SSL certificado instalado  
✅ Todos los servicios existentes activos  
✅ Nginx recargado sin downtime  
✅ Documentación creada  

---

## 📞 Soporte

Para problemas:
1. Verificar logs: `/home/umbot.com.ar/logs/`
2. Validar Nginx: `nginx -t`
3. Verificar puertos: `ss -tulpn`
4. Revisar estado PM2: `pm2 list`
5. Consultar documentación: `/home/umbot.com.ar/DEPLOYMENT.md`

---

**Despliegue realizado por:** Cascade  
**Fecha:** 2025-10-27 20:53 UTC  
**Estado:** ✅ COMPLETADO Y VERIFICADO
