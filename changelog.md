# Changelog

## [Sin versionar] - 2024-XX-XX

### Añadido

- Nuevo archivo `changelog.md` para registrar los cambios del proyecto.

### Cambiado

- `hooks/useSimulationCalculations.ts`:
  - Implementado crecimiento discreto de clientes.
  - Añadida interfaz `Result` con `clientsBreakdown`.
  - Modificada la lógica de cálculo para manejar clientes como entidades indivisibles.
  - Actualizado el cálculo de ingresos para cobrar tarifas de configuración solo para nuevos clientes.

- `components/RevenueChart.tsx`:
  - Actualizada la lógica del `CustomTooltip` para manejar valores posiblemente indefinidos.

- `components/ResultsTable.tsx`:
  - Actualizada la interfaz `ResultsTableProps` para reflejar los cambios en `formatClientsWithBreakdown`.
  - Modificada la lógica de renderizado para utilizar el nuevo formato de clientes.

### Corregido

- Errores de lint en varios archivos.
- Problemas de tipado relacionados con la propiedad `clientsBreakdown`.

### Pendiente

- Actualizar `components/dashboard.tsx` para reflejar los cambios en la estructura de datos.
- Revisar y actualizar `components/Sidebar.tsx` si es necesario.
- Asegurar que todos los componentes utilicen correctamente la nueva estructura de datos de clientes.
