# Documentación del Proyecto Intranet

Este directorio contiene toda la documentación del proyecto Intranet.

## Estructura de Documentación

### 📚 Storybook - Componentes UI
- **URL**: http://localhost:6006
- **Comando**: `npm run storybook`
- **Descripción**: Documentación interactiva de componentes React con ejemplos en vivo

### 📖 Docusaurus - Documentación del Proyecto
- **URL**: http://localhost:3000
- **Comando**: `cd docs && npm start`
- **Descripción**: Sitio web de documentación con guías, tutoriales y arquitectura

### 🔧 TypeDoc - API de Código
- **Directorio**: `./api/`
- **Comando**: `npm run docs:api` (genera) + `npm run docs:serve` (sirve)
- **URL**: http://localhost:8081
- **Descripción**: Documentación automática de tipos, interfaces y clases TypeScript

### 📖 OpenAPI - Documentación de API
- **Archivo**: `./openapi.yaml`
- **Comando**: `npm run docs:openapi`
- **URL**: http://localhost:8082
- **Descripción**: Documentación de endpoints REST con Redoc

## Comandos Disponibles

```bash
# Componentes (Storybook)
npm run storybook          # Inicia servidor de Storybook
npm run build-storybook    # Build estático de Storybook

# Documentación del proyecto (Docusaurus)
cd docs && npm start       # Servidor de desarrollo
cd docs && npm run build   # Build de producción

# API de código (TypeDoc)
npm run docs:api           # Genera documentación TypeScript
npm run docs:serve         # Sirve documentación en puerto 8081

# API REST (OpenAPI)
npm run docs:openapi       # Sirve documentación OpenAPI en puerto 8082
```

## Flujo de Documentación

### Para Desarrolladores de Componentes
1. **Desarrollar componente** en `src/ui/components/`
2. **Crear story** en `*.stories.tsx` junto al componente
3. **Documentar props** con JSDoc en el componente
4. **Ejecutar Storybook** para ver resultado

### Para Desarrolladores de Lógica de Negocio
1. **Escribir código** en `src/domain/`, `src/application/`, `src/infrastructure/`
2. **Documentar con JSDoc** interfaces y clases importantes
3. **Generar docs** con `npm run docs:api`
4. **Revisar resultado** en navegador

### Para Documentar API REST
1. **Definir endpoints** en `docs/openapi.yaml`
2. **Especificar schemas** y responses
3. **Servir documentación** con `npm run docs:openapi`
4. **Probar endpoints** desde la interfaz

## Convenciones

### Componentes React
- Usar JSDoc para describir props
- Incluir ejemplos de uso en stories
- Documentar casos edge
- Usar TypeScript interfaces para props

```tsx
/**
 * Header component for the main layout.
 * Displays the app bar with menu button and theme toggle.
 * 
 * @param onMenuClick - Callback when menu button is clicked
 * @param drawerWidth - Width of the sidebar drawer in pixels
 */
interface HeaderProps {
  /** Callback function triggered when menu button is clicked */
  onMenuClick: () => void;
  /** Width of the sidebar drawer in pixels (default: 240) */
  drawerWidth: number;
}
```

### Código TypeScript
- Usar JSDoc para interfaces y clases públicas
- Documentar parámetros y returns
- Incluir ejemplos cuando sea relevante

```ts
/**
 * Repository for managing user data.
 * Implements the UserRepository port from domain layer.
 * 
 * @example
 * ```ts
 * const userRepo = new HttpUserRepository();
 * const user = await userRepo.find(123);
 * ```
 */
export class HttpUserRepository implements UserRepository {
  /**
   * Find user by ID.
   * 
   * @param id - User ID to search for
   * @returns Promise resolving to User or undefined if not found
   * @throws {UserNotFoundError} When user doesn't exist
   */
  async find(id: number): Promise<User | undefined> {
    // implementation
  }
}
```

### API REST
- Seguir OpenAPI 3.0.3
- Incluir ejemplos en requests/responses
- Documentar códigos de error
- Usar tags para organizar endpoints

## Herramientas y Stack

- **Storybook 9.x** - Componentes UI
- **Docusaurus 3.x** - Sitio web de documentación
- **TypeDoc** - Documentación automática TS
- **OpenAPI 3.x** - Especificación de API
- **Redoc** - UI para documentación OpenAPI
- **react-docgen-typescript** - Extracción automática de props
