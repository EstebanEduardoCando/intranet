# 🔒 Guía de Seguridad del Proyecto

## ⚠️ INFORMACIÓN IMPORTANTE

Este proyecto utiliza **Supabase** como backend. Las credenciales son **CONFIDENCIALES** y nunca deben ser commiteadas al repositorio.

## 🔧 Configuración de Variables de Entorno

### **1. Copiar archivo de ejemplo**
```bash
cp .env.example .env
```

### **2. Obtener credenciales de Supabase**
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings > API**
4. Copia:
   - **Project URL**
   - **anon/public key**

### **3. Actualizar .env**
```env
PORT=8080

# Supabase Configuration
VITE_SUPABASE_URL=https://tu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
VITE_SUPABASE_PROJECT_ID=tu-project-id
```

## 🚨 NUNCA Commitear

### **❌ Archivos Prohibidos**
- `.env` (cualquier variante)
- Credenciales hardcodeadas en código
- URLs con project IDs reales
- API keys o tokens

### **✅ Archivos Permitidos**
- `.env.example` (sin credenciales reales)
- Documentación con placeholders
- Configuración sin datos sensibles

## 🛡️ .gitignore Configurado

El archivo `.gitignore` está configurado para prevenir leaks de seguridad:

```gitignore
# Variables de entorno
.env
.env.*
.env.local
.env.development
.env.test
.env.production
!.env.example

# Documentación con credenciales
SUPABASE_SETUP.md
SUPABASE_CONFIG.md

# Claude Code settings
.claude/
```

## 🔍 Verificación Antes de Commit

Antes de hacer commit, verifica:

```bash
# Buscar credenciales accidentales
grep -r "fudwyjoq\|eyJhbGci" . --exclude-dir=node_modules

# Verificar que .env no está siendo trackeado
git status | grep -v ".env"
```

## 🚀 Setup para Nuevo Desarrollador

1. **Clonar repositorio**
2. **Crear .env** desde .env.example
3. **Obtener credenciales** del administrador del proyecto
4. **Ejecutar migración** SQL en Supabase (ver README)
5. **Verificar configuración** con `npm start`

## 📞 Contacto para Credenciales

Si necesitas acceso a las credenciales de Supabase:
- Contacta al administrador del proyecto
- No las solicites por medios no seguros
- Usa un gestor de passwords para almacenarlas

## 🔄 Rotación de Credenciales

En caso de leak de credenciales:
1. **Regenerar keys** en Supabase Dashboard
2. **Actualizar .env** local
3. **Notificar al equipo** de desarrollo
4. **Verificar logs** de acceso sospechoso

---

**⚠️ RECUERDA: La seguridad es responsabilidad de todos. ¡No commitees credenciales!**