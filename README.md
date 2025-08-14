# Intranet

Aplicación React con TypeScript implementando arquitectura hexagonal (puertos y adaptadores). Sistema de intranet con autenticación, navegación protegida y tema claro/oscuro.

## Stack Tecnológico

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **Material-UI (MUI)** - Componentes UI
- **Tailwind CSS** - Utilidades CSS
- **React Router DOM** - Enrutamiento
- **Zustand** - Gestión de estado

### Herramientas de Desarrollo
- **ESLint** - Linting
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Prefijos CSS automáticos

## Arquitectura

La arquitectura hexagonal separa la lógica de negocio del resto de capas:
- **Puertos**: Definen interfaces de comunicación
- **Adaptadores**: Proveen implementaciones concretas (UI, infraestructura)
- **Dominio**: Entidades y reglas de negocio (núcleo)
- **Aplicación**: Casos de uso y servicios
- **Infraestructura**: Adaptadores externos (API, BD)
- **UI**: Componentes React y presentación

## Estructura de carpetas

```text
src/
├── application/           # Casos de uso y servicios de aplicación
├── domain/               # Entidades, value objects y puertos del dominio
├── infrastructure/       # Adaptadores externos (API, BD, etc.)
├── ui/                   # Capa de presentación React
│   ├── components/       # Componentes reutilizables
│   │   └── layout/       # Layout principal (Header, Sidebar, Footer)
│   ├── pages/           # Páginas de la aplicación
│   ├── routes/          # Configuración de rutas y guards
│   └── store/           # Stores de Zustand
├── main.tsx             # Punto de entrada React
└── index.css            # Estilos globales
public/                  # Assets estáticos
index.html              # Punto de entrada HTML
```

## Funcionalidades Implementadas

- ✅ Sistema de autenticación básico
- ✅ Tema claro/oscuro con persistencia
- ✅ Layout responsivo con sidebar
- ✅ Rutas protegidas
- ✅ Navegación entre páginas
- ✅ Componentes base con MUI + Tailwind

## Ejemplo de Arquitectura

Ejemplo de implementación siguiendo la arquitectura hexagonal:

```ts
// src/domain/user/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// src/domain/user/UserRepository.ts (Puerto)
export interface UserRepository {
  find(id: number): Promise<User | undefined>;
  save(user: User): Promise<void>;
}

// src/application/user/GetUser.ts (Caso de uso)
import { UserRepository } from '../../domain/user/UserRepository';

export class GetUser {
  constructor(private userRepository: UserRepository) {}
  
  async execute(id: number): Promise<User | undefined> {
    return await this.userRepository.find(id);
  }
}

// src/infrastructure/user/HttpUserRepository.ts (Adaptador)
import { UserRepository } from '../../domain/user/UserRepository';
import { User } from '../../domain/user/User';

export class HttpUserRepository implements UserRepository {
  async find(id: number): Promise<User | undefined> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
  
  async save(user: User): Promise<void> {
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  }
}
```

## Stack de Documentación Recomendado

### Para Componentes UI
- **Storybook** - Desarrollo y documentación de componentes en aislamiento
- **react-docgen-typescript** - Generación automática de tablas de props

### Para Documentación del Proyecto
- **Docusaurus** - Sitio web de documentación (guías, how-tos, arquitectura)
- **TypeDoc** - Referencia automática del código TypeScript (integrado en Docusaurus)

### Para API Documentation
- **OpenAPI** - Especificación de API REST
- **Redoc** o **Swagger UI** - Interfaz visual para la documentación de API

### Configuración Recomendada
```bash
# Instalar Storybook
npx storybook@latest init

# Instalar Docusaurus
npx create-docusaurus@latest docs classic --typescript

# Instalar herramientas de documentación
npm install --save-dev typedoc react-docgen-typescript
```

## Uso

### Instalación de dependencias

```bash
npm install
```

### Variables de entorno

El archivo `.env` define la configuración del proyecto. Por defecto incluye:

```bash
PORT=8080
```

Este valor determina el puerto del servidor de desarrollo.

### Comandos disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo con Vite
npm run build         # Build de producción
npm test              # Ejecutar pruebas (por configurar)

# Documentación (por configurar)
npm run storybook     # Servidor de Storybook para componentes
npm run docs:dev      # Servidor de desarrollo de Docusaurus
npm run docs:build    # Build de documentación
npm run docs:serve    # Servidor de documentación estática
```

### Estructura de desarrollo

1. **Desarrollo de componentes**: Usa Storybook para desarrollar componentes de forma aislada
2. **Documentación**: Escribe guías y documentación en Docusaurus
3. **API**: Documenta endpoints con OpenAPI/Swagger
4. **Código**: TypeDoc genera automáticamente la referencia de tipos y funciones

## Próximos Pasos

- [ ] Configurar Storybook para componentes
- [ ] Setup Docusaurus para documentación del proyecto
- [ ] Integrar TypeDoc con Docusaurus
- [ ] Configurar OpenAPI para documentación de API
- [ ] Implementar pruebas unitarias
- [ ] Agregar linting y formateo automático

## Información Adicional

- **Arquitectura**: Sigue los principios de arquitectura hexagonal
- **Tipado**: TypeScript estricto en todo el proyecto
- **Estilos**: Combinación de Material-UI y Tailwind CSS
- **Estado**: Zustand para gestión de estado global
- **Rutas**: React Router con protección de rutas
