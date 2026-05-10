# 📊 DIAGNÓSTICO VISUAL - Client/Contact No Aparece en Combobox

## El Flujo Roto Actualmente

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    USUARIO CREA CLIENTE EN MODAL                        │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  RegisterClientModal.tsx → ClientForm.tsx → createClient() mutation    │
│                                                                         │
│  Backend Response: { id: 123, commercialName: "ABC Corp", ... }       │
│                                                                         │
│  onSuccess() en ClientForm.tsx                                         │
│  ↓                                                                      │
│  Llama: RegisterClientModal.onSuccess(newClient)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  VisitFlowContainer.tsx → handleClientCreated()                        │
│                                                                         │
│  ✅ queryClient.setQueryData(["clients", { limit: 10, name: "" }])    │
│  ❌ Pero ClientSearchSelector busca con ["clients", { term: "", ... }]│
│                                                                         │
│  Zustand: setNewClientId("123")                                        │
│  ✅ newClientId guardado en Store                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Modal cierra, vuelve a VisitForm/QuoteForm                            │
│                                                                         │
│  ClientSearchSelector se monta:                                        │
│  • Lee newClientId = "123" desde Zustand ✅                            │
│  • Busca cliente con term: "" en useClients({ term: "", limit: 10 })  │
│  • Query Key: ["clients", { term: "", limit: 10 }]                    │
│                                                                         │
│  ❌ MISMATCH: Datos en ["clients", { name: "", limit: 10 }]          │
│  ❌ Query key diferente = caché diferente = NO ENCUENTRA              │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  useClients({ term: "", limit: 10 }) hace NUEVA query al servidor     │
│                                                                         │
│  useEffect intenta sincronizar:                                        │
│  if (newClientId && clients.length > 0) {                             │
│      const found = clients.find(c => c.id === newClientId)            │
│      if (found) {                                                       │
│          onChange(newClientId)  // ← NO ENTRA AQUÍ                     │
│          clearNewClientId()     // ← NO EJECUTA                        │
│      }                                                                  │
│  }                                                                      │
│                                                                         │
│  Si servidor es lento:                                                 │
│  • clients = [] (aún vacío)                                            │
│  • useEffect no entra al if                                            │
│  • clearNewClientId() nunca se ejecuta                                 │
│  • COMBOBOX SIGUE VACÍO ❌                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6 Puntos de Falla Identificados

```
                      PUNTO DE FALLA #1
                      ================
    VisitFlowContainer.setQueryData        ClientSearchSelector.useClients
            │                                        │
            ├─> ["clients",                 ├─> ["clients",
            │   { limit: 10, name: "" }]    │    { term: "", limit: 10 }]
            │                                │
            └────────────── ❌ DIFERENTE ──────────┘

                      PUNTO DE FALLA #2
                      ================
    handleClientCreated() guarda:          ClientSearchSelector busca:
    { limit: 10, name: "" }                { term: "searchValue", limit: 10 }
             │                                     │
             └────────────── ❌ DIFERENTE ──────────┘

                      PUNTO DE FALLA #3
                      ================
    setQueryData(["contacts-client", 123])
            │
            ├─> Actualiza caché ✅
            │
            ├─> invalidateQueries() 
            │
            ├─> Marca como STALE ⚠️
            │
            └─> Inicia REFETCH
                    │
                    └─> Servidor devuelve datos viejos ❌
                        Sobrescribe setQueryData ❌

                      PUNTO DE FALLA #4
                      ================
    newClientId = "123"  (Zustand)
            │
            ├─> clients = [] (caché vacío)
            │
            ├─> useEffect busca en clients
            │
            ├─> find() retorna undefined
            │
            └─> clearNewClientId() NUNCA EJECUTA
                    │
                    └─> newClientId sigue en Zustand ∞

                      PUNTO DE FALLA #5
                      ================
    ContactSearchSelector monta
            │
            ├─> clientId = undefined (aún no seleccionado)
            │
            ├─> useContactsByClient(undefined)
            │
            ├─> Query deshabilitada (enabled: false)
            │
            └─> contacts = [] (vacío)
                    │
                    └─> newContactId nunca se encuentra ❌

                      PUNTO DE FALLA #6
                      ================
    Cliente guardado en caché:
    ["clients", { name: "", limit: 10 }]
            │
            │  Pero buscado en:
            │  ["clients", { term: "", limit: 10 }]
            │
            └─> Diferentes QUERY KEYS = Diferentes CACHÉ ❌
```

---

## Comparativa: Antes vs Después

### ANTES (Roto ❌)

```typescript
// VisitFlowContainer.tsx
queryClient.setQueryData(
  ["clients", { limit: 10, name: "" }],  // ← HARDCODEADO
);

// ClientSearchSelector.tsx
const { clients } = useClients({
  term: debouncedSearch,  // ← DINÁMICO
  limit: 10,
});
// Query Key: ["clients", { term: "", limit: 10 }]
// ❌ DIFERENTE
```

### DESPUÉS (Arreglado ✅)

```typescript
// AMBOS usan la misma función normalizada
import { clientQueryKeys } from "@/lib/queryKeys";

// VisitFlowContainer.tsx
queryClient.setQueryData(
  clientQueryKeys.list({ term: "", limit: 10 }),
  // Query Key: ["clients", { term: "", limit: 10 }]
);

// ClientSearchSelector.tsx
const { clients } = useClients({
  term: debouncedSearch,
  limit: 10,
});
// Query Key: clientQueryKeys.list({ term: debouncedSearch, limit: 10 })
// ✅ SIEMPRE IGUAL (normalizada)
```

---

## Timeline: Cómo Debería Funcionar (Post-Corrección)

```
TIEMPO │ ACCIÓN                                      │ ESTADO DEL CLIENTE
───────┼─────────────────────────────────────────────┼─────────────────────
T0     │ Usuario hace click "Registrar Cliente"      │ -
       │                                             │
T1     │ RegisterClientModal abre                    │ -
       │ ClientForm carga                            │ -
       │                                             │
T2     │ Usuario ingresa datos y submitea            │ Enviando...
       │                                             │
T3     │ Backend retorna { id: 123, name: "ABC" }    │ Creado en servidor
       │                                             │
T4     │ onSuccess() en ClientForm                   │ -
       │ Llama handleClientCreated()                 │ -
       │                                             │
T5     │ ✅ setQueryData en QUERY KEY NORMALIZADO    │ EN CACHÉ ✅
       │ queryClient.setQueryData(                   │
       │   ["clients", { term: "", limit: 10 }]     │
       │ )                                           │
       │                                             │
T6     │ ✅ setNewClientId("123")                    │ EN ZUSTAND ✅
       │                                             │
T7     │ Modal cierra, vuelve a VisitForm            │ -
       │ ClientSearchSelector se monta              │ -
       │                                             │
T8     │ ClientSearchSelector busca en MISMO KEY     │ -
       │ Query: ["clients", { term: "", limit: 10 }]│
       │                                             │
T9     │ ✅ ENCUENTRA EL CLIENTE EN CACHÉ            │ ENCONTRADO ✅
       │                                             │
T10    │ useEffect sincroniza:                       │ -
       │ • Lee newClientId = "123" de Zustand       │
       │ • Encuentra cliente en array                │ 
       │ • onChange("123")                           │
       │ • clearNewClientId()                        │
       │                                             │
T11    │ ✅ CLIENTE SELECCIONADO EN COMBOBOX         │ SELECCIONADO ✅
       │ ✅ ZUSTAND LIMPIO                           │ LIMPIO ✅
```

---

## Comparativa: Impacto de los 6 Problemas

| Problema | Crítica | Síntoma | Solución |
|----------|---------|---------|----------|
| #1: Query Key Mismatch | 🔴 CRÍTICA | Cliente NO aparece | `queryKeys.ts` |
| #2: Filter Type Mismatch | 🔴 CRÍTICA | Cliente NO aparece | Normalizar `term` |
| #3: Race Condition Invalidate | 🟠 ALTA | Cliente desaparece | Remover invalidate |
| #4: Zustand Cleanup Never Runs | 🟠 ALTA | Zustand polluted | Mejorar condition |
| #5: Contact ClientId Undefined | 🟠 ALTA | Contacto NO aparece | Esperar clientId |
| #6: Cache Timing | 🟠 ALTA | Lag/desync | Todo lo anterior |

---

## Archivos a Modificar (En Orden)

```
FASE 1: Crear + Actualizar Hooks
├─ ✨ CREAR: src/lib/queryKeys.ts
├─ 🔧 ACTUALIZAR: src/hooks/client/useClient.ts
├─ 🔧 ACTUALIZAR: src/hooks/client/useContact.ts
└─ 🔧 ACTUALIZAR: src/components/shared/ClientSearchSelector.tsx

FASE 2: Actualizar Selectores
├─ 🔧 ACTUALIZAR: src/components/shared/ContactSearchSelector.tsx
└─ (Mejoras menores en logic)

FASE 3: Actualizar Flow Containers
├─ 🔧 ACTUALIZAR: src/components/visit/VisitFlowContainer.tsx
└─ 🔧 ACTUALIZAR: src/components/quote/form/QuoteFlowContainer.tsx

BONUS: Remover Invalidate Inmediato
└─ 🔧 ACTUALIZAR: src/hooks/client/useContact.ts (onSuccess)
```

---

## Validación Post-Implementación

```bash
# Buscar query keys hardcodeadas
grep -r 'queryKey.*\["clients"' src/components src/hooks --include="*.tsx" --include="*.ts"

# Validar que se usa queryKeys helper
grep -r 'clientQueryKeys' src/ --include="*.tsx" --include="*.ts"

# Debe tener coincidencias SÓLO en:
# - src/lib/queryKeys.ts (definición)
# - src/hooks/client/useClient.ts
# - src/components/shared/ClientSearchSelector.tsx
# - src/components/visit/VisitFlowContainer.tsx
# - src/components/quote/form/QuoteFlowContainer.tsx
```

---

**Estado:** Documento completado ✅  
**Siguiente paso:** Confirmar para proceder con la implementación
