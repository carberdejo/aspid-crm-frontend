# 🎯 RESUMEN EJECUTIVO - Solución Client/Contact No Aparece

**Generado:** Mayo 2026  
**Estado:** Análisis Completo ✅ | Plan Detallado ✅ | Listo para Implementar

---

## 📊 Diagnóstico en Una Línea

**El cliente se crea y se guarda en caché con la key `["clients", { name: "" }]`, pero se busca con la key `["clients", { term: "" }]`. Dos keys diferentes = dos cachés diferentes = cliente desaparece.**

---

## 6 Problemas Raíz Identificados

### 1. 🔴 Query Key Mismatch (CRÍTICA)
- **Dónde:** `VisitFlowContainer.tsx:48` vs `ClientSearchSelector.tsx:47-50`
- **Problema:** setQueryData usa `{ name: "" }` pero busca en `{ term: "" }`
- **Impacto:** Cliente NO aparece en combobox
- **Solución:** Crear `src/lib/queryKeys.ts` con función normalizada

### 2. 🔴 Filter Object Type Inconsistency (CRÍTICA)
- **Dónde:** `useClient.ts` vs `ClientSearchSelector.tsx`
- **Problema:** Una llama con `name`, otra con `term`
- **Impacto:** Query keys completamente diferentes
- **Solución:** Normalizar siempre a usar `term` como propiedad estándar

### 3. 🟠 Race Condition - invalidateQueries (ALTA)
- **Dónde:** `VisitFlowContainer.tsx:90-92` y `QuoteFlowContainer.tsx:86-88`
- **Problema:** `setQueryData` + `invalidateQueries` inmediato = refetch sobrescribe
- **Impacto:** Cliente aparece, luego desaparece
- **Solución:** Remover `invalidateQueries` después de `setQueryData`

### 4. 🟠 Zustand Cleanup Loop (ALTA)
- **Dónde:** `ClientSearchSelector.tsx:52-63`
- **Problema:** Si cliente NO se encuentra, `clearNewClientId()` nunca ejecuta
- **Impacto:** Zustand contaminado, el estado se queda forever
- **Solución:** Mejorar condición del useEffect

### 5. 🟠 Contact Query Depends on Undefined ClientId (ALTA)
- **Dónde:** `ContactSearchSelector.tsx:27` + `useContact.ts:11`
- **Problema:** Si clientId es undefined, query no ejecuta = contacts vacío
- **Impacto:** Nuevo contacto nunca se encuentra
- **Solución:** Esperar a que clientId esté listo antes de buscar

### 6. 🟠 Cache Timing Issue (ALTA)
- **Dónde:** Multi-componente
- **Problema:** Datos en caché pero con query key incorrecto
- **Impacto:** Cliente existe en el universo de React Query, pero inaccessible
- **Solución:** Todos los anteriores se resuelven con esto

---

## ✅ Solución en 3 Fases

### FASE 1: Normalizar Query Keys (2-3 archivos nuevos/actualizados)
```
CREAR:  src/lib/queryKeys.ts
UPDATE: src/hooks/client/useClient.ts
UPDATE: src/hooks/client/useContact.ts
UPDATE: src/components/shared/ClientSearchSelector.tsx
UPDATE: src/components/shared/ContactSearchSelector.tsx
```

**Beneficio:** Garante que TODAS las referencias usan la misma query key.

### FASE 2: Mejorar Sincronización Zustand (2 archivos)
```
UPDATE: src/components/shared/ClientSearchSelector.tsx
UPDATE: src/components/shared/ContactSearchSelector.tsx
```

**Beneficio:** El estado Zustand se limpia correctamente, sin loops infinitos.

### FASE 3: Remover Race Conditions (2 archivos)
```
UPDATE: src/components/visit/VisitFlowContainer.tsx
UPDATE: src/components/quote/form/QuoteFlowContainer.tsx
```

**Beneficio:** Clientes/contactos NO desaparecen después de ser creados.

---

## 📈 Resultado Esperado

### Antes (Roto)
```
Usuario crea cliente → Modal cierra → Combobox vacío ❌
Búsqueda manual → No encuentra cliente recién creado ❌
Interfaz inconsistente → Usuarios reportan "está roto" ❌
```

### Después (Arreglado)
```
Usuario crea cliente → Modal cierra → Combobox muestra cliente ✅
Seleccionado automáticamente → Form poblado ✅
Funciona incluso con red lenta ✅
Contactos también funcionan ✅
```

---

## 📚 Documentación Generada

He creado 2 archivos de referencia en tu proyecto:

1. **`SOLUTION_PLAN.md`** (Documento Detallado 📖)
   - Explicación profunda de cada problema
   - Código completo de cada solución
   - Paso a paso para cada fase
   - Checklist de implementación
   - Testing guidelines

2. **`SOLUTION_VISUAL.md`** (Diagrama Visual 🖼️)
   - Flujo roto visualmente
   - 6 puntos de falla ilustrados
   - Timeline: Antes vs Después
   - Comparativa rápida

---

## 🚀 Próximos Pasos

### Option A: Implementación Inmediata
- Responde: `implementar`
- Procederé a hacer todos los cambios según el plan

### Option B: Revisión de Problemas Específicos
- Pregunta sobre qué problema quieres que profundice más
- Responde: `explica [número del problema]`

### Option C: Verificación Manual Primero
- Responde: `verificar`
- Te guiaré a encontrar el problema en DevTools paso a paso

---

## 💾 Archivos Generados

✅ `SOLUTION_PLAN.md` - Plan completo con código  
✅ `SOLUTION_VISUAL.md` - Diagramas y timeline  
✅ Este resumen ejecutivo

---

**¿Proceder con la implementación?**
