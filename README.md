# Intranet

Base para una aplicación React siguiendo una arquitectura hexagonal (puertos y adaptadores).

## Arquitectura

La arquitectura hexagonal separa la lógica de negocio del resto de capas. Los **puertos**
definen la interfaz de comunicación y los **adaptadores** proveen las implementaciones
concretas (por ejemplo, UI o infraestructura).

## Estructura de carpetas

```text
src/
├── application/    # Casos de uso y servicios
├── domain/         # Entidades y puertos del dominio
├── infrastructure/ # Adaptadores externos (API, BD, etc.)
└── ui/             # Componentes React
public/             # Assets estáticos
index.html          # Punto de entrada
```

## Ejemplo

Ejemplo mínimo de un caso de uso que consulta un usuario:

```ts
// src/domain/user/User.ts
export interface User {
  id: number;
  name: string;
}

// src/domain/user/UserRepository.ts
export interface UserRepository {
  find(id: number): Promise<User | undefined>;
}

// src/application/user/GetUser.ts
import { UserRepository } from '../../domain/user/UserRepository';
export class GetUser {
  constructor(private repo: UserRepository) {}
  run(id: number) {
    return this.repo.find(id);
  }
}
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

### Levantar el sistema

```bash
npm start
```

Este comando arranca el servidor de desarrollo de Vite.

### Ejecutar pruebas

```bash
npm test
```

Configura un framework de testing (p. ej. Jest) para ejecutar pruebas reales.

### Instalar nuevos componentes

```bash
npm install <nombre-del-paquete>
```

## Información adicional

- El código está escrito en TypeScript.
- Sigue la estructura propuesta para mantener la separación entre dominio, aplicación,
  infraestructura y UI.
