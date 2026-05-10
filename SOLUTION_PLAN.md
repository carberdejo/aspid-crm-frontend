# 🔧 PLAN DE SOLUCIÓN - Client/Contact No Aparece en Combobox

**Estado:** Diagnóstico completo realizado  
**Fecha:** Mayo 2026  
**Problema:** Clientes y contactos creados en modales NO aparecen en los combobox de selección

---

## 📋 RESUMEN EJECUTIVO

Después de analizar 15+ archivos del flujo de Visit y Quote, he identificado **6 problemas críticos** en la integración entre TanStack Query y Zustand que causan que los registros recién creados desaparezcan de los combobox:

1. **Mismatch de Query Keys** - setQueryData usa keys hardcodeadas que no coinciden
2. **Type Mismatch en Filters Object** - Las propiedades del objeto filters varían
3. **Race Condition en Invalidación** - invalidateQueries sobrescribe setQueryData
4. **Zustand State Cleanup** - clearNewClientId nunca se ejecuta si hay mismatch
5. **Contact Query Dependency** - ContactSearchSelector no espera a que clientId esté listo
6. **Cache Timing Issue** - El cliente existe en caché pero con diferente query key

---

## 🔴 PROBLEMA 1: Query Key Mismatch - El Corazón del Problema

### Ubicación
- **Archivo:** `src/components/visit/VisitFlowContainer.tsx` líneas 47-57
- **Archivo:** `src/components/quote/form/QuoteFlowContainer.tsx` líneas 50-60
- **Hook:** `src/hooks/client/useClient.ts` línea 12
- **Componente:** `src/components/shared/ClientSearchSelector.tsx` línea 47

### El Problema en Detalle

#### Código en FlowContainer (INCORRECTO):
```typescript
// VisitFlowContainer.tsx:47-48
queryClient.setQueryData(
  ["clients", { limit: 10, name: "" }],  // ← KEY HARDCODEADA
  (old: PaginatedResponse<ClientListItem>) => {
    if (!old) return { items: [newClient], total: 1 };
    return {
      ...old,
      items: [newClient, ...old.items],
      total: (old.total || 0) + 1,
    };
  },
);
```

#### Hook useClients (DINÁMICO):
```typescript
// useClient.ts:12
const query = useQuery({
  queryKey: ['clients', filters],  // ← DINÁMICO: puede ser cualquier estructura
  queryFn: () => clientService.getClients(filters),
  staleTime: 1000 * 60,
});
```

#### Selector que busca (DIFERENTE):
```typescript
// ClientSearchSelector.tsx:47-50
const { clients, isLoading } = useClients({
  term: debouncedSearch,  // ← "term" no "name"
  limit: 10,
});
```

### Timeline de Fallos

| Paso | Acción | Query Key | Resultado |
|------|--------|-----------|-----------|
| 1 | Usuario crea cliente | - | Exitoso en servidor |
| 2 | FlowContainer.setQueryData | `["clients", { limit: 10, name: "" }]` | ✅ Datos en caché |
| 3 | Usuario busca cliente vacío | `["clients", { term: "", limit: 10 }]` | ❌ DIFERENTE KEY |
| 4 | ClientSearchSelector busca datos | Busca en `{ term: "" }` | ❌ No encuentra |
| 5 | Hook hace query al servidor | Llama API | Lento si servidor rezagado |
| 6 | Usuario ve combobox vacío | - | ❌ FALLO |

### Por Qué Ocurre

TanStack Query usa **serialización profunda** para comparar query keys:
- `{ limit: 10, name: "" }` ≠ `{ term: "", limit: 10 }` (diferentes propiedades)
- `{ term: "John", limit: 10 }` ≠ `{ limit: 10, term: "John" }` (diferente orden)

**Cada variación = caché separado**

---

## 🔴 PROBLEMA 2: Type Mismatch en Objeto Filters

### Ubicación
- **Interfaz:** `src/interfaces/client.interface.ts` (asumo que existe)
- **Hook:** `src/hooks/client/useClient.ts`
- **Componente:** `src/components/shared/ClientSearchSelector.tsx`

### El Problema

El objeto `ClientFilters` puede tener propiedades inconsistentes:

```typescript
// En ClientSearchSelector.tsx:47-50
const { clients, isLoading } = useClients({
  term: debouncedSearch,   // ← Nombre: "term"
  limit: 10,
});

// En VisitFlowContainer.tsx:48
["clients", { limit: 10, name: "" }]  // ← Nombre: "name"
```

**¿Son iguales?** NO. Una usa `term`, otra usa `name`.

### Impacto

- Cuando el componente busca clientes: `{ term: "", limit: 10 }`
- FlowContainer guardó datos en: `{ name: "", limit: 10 }`
- **Dos query keys diferentes = dos caché separados**

---

## 🔴 PROBLEMA 3: Race Condition - Invalidation Sobrescribe setQueryData

### Ubicación
- **Archivo:** `src/components/visit/VisitFlowContainer.tsx` líneas 81-92
- **Archivo:** `src/components/quote/form/QuoteFlowContainer.tsx` líneas 79-89

### El Problema

```typescript
if (targetClientId) {
  // PASO 1: Actualiza el caché
  queryClient.setQueryData(
    ["contacts-client", targetClientId],
    (old: Contact[]) => {
      if (!old) return [newContact];
      return [...old, newContact];
    },
  );

  // PASO 2: Marca como stale e inicia refetch
  queryClient.invalidateQueries({
    queryKey: ["contacts-client", targetClientId],
  });
}
```

### Timeline de Race Condition

```
Tiempo │ Acción                          │ Estado del Caché
───────┼─────────────────────────────────┼──────────────────────
T0     │ setQueryData actualiza caché    │ [newContact, ...old]
T1     │ invalidateQueries marca stale   │ MARKED AS STALE
T2     │ Componente usa dato updteado    │ ✅ Ve nuevo contacto
T3     │ TanStack Query inicia refetch   │ Llamada al servidor
T4     │ Servidor retorna datos viejos   │ ❌ Sobrescribe con viejos
T5     │ Componente re-renderiza         │ ❌ CONTACTO DESAPARECE
```

### Problema Específico

- `setQueryData` es **optimista** (solo actualiza local)
- `invalidateQueries` dispara un **refetch** que puede obtener datos diferentes
- Si el servidor aún no sincronizó el contacto, el refetch devuelve los datos sin el nuevo
- **Efecto: El contacto aparece un instante, luego desaparece**

---

## 🔴 PROBLEMA 4: Zustand State Cleanup Never Executes

### Ubicación
- **Archivo:** `src/components/shared/ClientSearchSelector.tsx` líneas 52-63

### El Problema

```typescript
useEffect(() => {
  if (newClientId && clients.length > 0) {
    const newClient = clients.find(
      (c) => String(c.id) === String(newClientId),
    );
    if (newClient) {
      onChange(newClientId);
      onClientChange?.(newClientId);
      clearNewClientId();  // ← NUNCA SE EJECUTA SI NO ENCUENTRA
    }
    // Si newClient es undefined, clearNewClientId() NUNCA se llama
  }
}, [newClientId, clients, onChange, onClientChange, clearNewClientId]);
```

### El Ciclo Infinito Silencioso

```
Iteración │ newClientId │ clients          │ Encuentra? │ clearNewClientId?
──────────┼─────────────┼──────────────────┼────────────┼─────────────────
1         │ "123"       │ [] (vacío)       │ NO         │ NO
2         │ "123"       │ [] (aún vacío)   │ NO         │ NO
3         │ "123"       │ [] (dependencia)  │ NO         │ NO
∞         │ "123"       │ [] (forever)     │ NO         │ NO ∞
```

**Causa raíz:** Como `clients` está vacío (problema #1), el `find()` nunca encuentra nada, así que `clearNewClientId()` nunca se ejecuta.

### Consecuencia

- `newClientId` permanece en Zustand indefinidamente
- En renders posteriores, el efecto intenta de nuevo pero sigue fallando
- Efecto secundario: Posibles errores en validación de formularios

---

## 🔴 PROBLEMA 5: Contact Query Depends on Undefined ClientId

### Ubicación
- **Archivo:** `src/components/shared/ContactSearchSelector.tsx` líneas 20-39
- **Hook:** `src/hooks/client/useContact.ts` línea 11

### El Problema

```typescript
// ContactSearchSelector.tsx:20
export function ContactSearchSelector({ 
  value, 
  onChange, 
  clientId,  // ← Puede ser undefined
  disabled 
}: Props) {
  const { contact } = useContactsByClient(clientId);  // ← Pasa clientId

  useEffect(() => {
    if (newContactId && !isLoading && contacts.length > 0) {
      const newContact = contacts.find(c => String(c.id) === String(newContactId));
      if (newContact) {
        onChange(String(newContactId));
        clearNewContactId();
      }
    }
  }, [newContactId, contacts, isLoading, onChange, clearNewContactId]);
```

#### Hook useContactsByClient:
```typescript
// useContact.ts:6-12
export const useContactsByClient = (id: number) => {
  const useQueryContact = useQuery({
    queryKey: ["contacts-client", id],
    queryFn: () => clientService.getContactsByClient(id),
    staleTime: 60 * 1000,
    enabled: id !== null && id !== undefined && id > 0,  // ← NO EJECUTA SI id INVÁLIDO
  });
  // ...
};
```

### Timeline de Fallos

```
Paso │ Acción                              │ Resultado
─────┼─────────────────────────────────────┼─────────────────────
1    │ Usuario crea cliente (id: 123)      │ newClientId = "123"
2    │ FlowContainer.setNewClientId("123") │ Zustand actualizado
3    │ ContactSearchSelector monta         │ clientId = undefined (aún)
4    │ useContactsByClient(undefined)      │ Query deshabilitada
5    │ contacts = []                       │ Vacío
6    │ Usuario crea contacto               │ newContactId = "456"
7    │ useEffect busca en contacts[]       │ Encuentra? NO (vacío)
8    │ clearNewContactId() NO ejecuta      │ newContactId sigue en Zustand
9    │ Usuario cambia de cliente           │ clientId ahora = 123
10   │ useContactsByClient(123) ejecuta    │ Pero contacto ya pasó
11   │ contacts = [... sin el nuevo]       │ El nuevo NO está
```

### Problema Específico

- El contacto se crea cuando `clientId` aún es `undefined`
- Cuando `clientId` finalmente llega, la query se ejecuta pero el nuevo contacto NO está en la respuesta (aún no sincronizó desde BD)
- El componente nunca ve el nuevo contacto

---

## 🔴 PROBLEMA 6: Cache Timing Issue - Datos en Caché pero Inaccesibles

### Ubicación
- **Archivo:** `src/components/visit/VisitFlowContainer.tsx` línea 48
- **Archivo:** `src/components/quote/form/QuoteFlowContainer.tsx` línea 51

### El Problema

```typescript
// Cuando se crea un cliente en el servidor
// Backend retorna: { id: 123, commercialName: "ABC Corp", ... }

// FlowContainer intenta guardar en caché
queryClient.setQueryData(
  ["clients", { limit: 10, name: "" }],  // ← KEY ESPECÍFICA
  (old: PaginatedResponse<ClientListItem>) => {
    if (!old) return { items: [newClient], total: 1 };
    return {
      ...old,
      items: [newClient, ...old.items],
      total: (old.total || 0) + 1,
    };
  },
);

// Pero ClientSearchSelector busca con:
const { clients } = useClients({
  term: debouncedSearch,  // ← DIFERENTE
  limit: 10,
});
```

**Resultado:** El cliente está en caché, pero en un lugar diferente. Es como guardar algo en el cajón A pero buscar en el cajón B.

---

## ✅ PLAN DE SOLUCIÓN - 3 FASES

### FASE 1: Normalizar Query Keys (CRÍTICA)

**Objetivo:** Asegurar que TODAS las references a `["clients", ...]` usen exactamente el mismo formato de key.

#### Paso 1.1: Crear una función auxiliar de query keys

**Archivo:** `src/lib/queryKeys.ts` (CREAR NUEVO)

```typescript
import type { ClientFilters } from "@/interfaces/client.interface";
import type { VisitFilter } from "@/interfaces/visit.interface";
import type { QuoteFilters } from "@/services/quote.service";

/**
 * Genera query keys consistentes para clientes
 * Asegura que siempre se use "term" (no "name") y normaliza el objeto
 */
export const clientQueryKeys = {
  all: ["clients"] as const,
  
  list: (filters: Partial<ClientFilters> = {}) => [
    "clients",
    {
      term: filters.term || "",
      limit: filters.limit || 10,
      // Agregar otras propiedades normalizadas aquí
    },
  ] as const,
  
  search: (term: string, limit = 10) => [
    "clients",
    { term, limit },
  ] as const,
  
  detail: (id: number) => ["client", id] as const,
};

export const contactQueryKeys = {
  all: ["contacts"] as const,
  
  byClient: (clientId: number) => 
    ["contacts-client", clientId] as const,
  
  detail: (id: number) => ["contact", id] as const,
};

export const visitQueryKeys = {
  all: ["visits"] as const,
  
  list: (filters: VisitFilter = {}) => [
    "visits",
    filters,
  ] as const,
  
  detail: (id: number) => ["visit", id] as const,
};

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  
  list: (filters: QuoteFilters = {}) => [
    "quotes",
    filters,
  ] as const,
  
  detail: (id: number) => ["quote", id] as const,
};
```

**Beneficios:**
- ✅ Single source of truth para query keys
- ✅ Fuerza consistencia en toda la app
- ✅ Fácil mantener después

---

#### Paso 1.2: Actualizar useClient.ts

**Archivo:** `src/hooks/client/useClient.ts`

```typescript
import { clientQueryKeys } from "@/lib/queryKeys";

export const useClients = (filters: ClientFilters = {}) => {
  const query = useQuery({
    queryKey: clientQueryKeys.list(filters),  // ← USA FUNCIÓN NORMALIZADA
    queryFn: () => clientService.getClients(filters),
    staleTime: 1000 * 60,
  });

  const createMutation = useMutation({
    mutationFn: (clientData: ClientCreateDto) => 
      clientService.createClient(clientData),
    onSuccess: (newClient) => {
      toast.success("Registro completado", {
        description: newClient.message || "Cliente creado correctamente",
      });
      // ✅ NO usar setQueryData aquí - dejar que FlowContainer lo haga
    },
    // ...
  });

  return {
    clients: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createClient: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
```

---

#### Paso 1.3: Actualizar ClientSearchSelector.tsx

**Archivo:** `src/components/shared/ClientSearchSelector.tsx`

```typescript
import { clientQueryKeys } from "@/lib/queryKeys";

export function ClientSearchSelector({
  value,
  onChange,
  onClientChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const newClientId = useVisitFlowStore((state) => state.newClientId);
  const clearNewClientId = useVisitFlowStore((state) => state.clearNewClientId);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ AQUÍ SE USA LA QUERY KEY NORMALIZADA
  const { clients, isLoading } = useClients({
    term: debouncedSearch,
    limit: 10,
  });

  // ... resto del código igual
}
```

---

#### Paso 1.4: Actualizar VisitFlowContainer.tsx

**Archivo:** `src/components/visit/VisitFlowContainer.tsx`

```typescript
import { clientQueryKeys, contactQueryKeys } from "@/lib/queryKeys";

const handleClientCreated = useCallback(
  (newClient: ClienteCreateResponseItem) => {
    // ✅ USA QUERY KEY NORMALIZADA
    queryClient.setQueryData(
      clientQueryKeys.list({ term: "", limit: 10 }),
      (old: PaginatedResponse<ClientListItem>) => {
        if (!old) return { items: [newClient], total: 1 };
        return {
          ...old,
          items: [newClient, ...old.items],
          total: (old.total || 0) + 1,
        };
      },
    );
    
    // También actualiza la lista completa sin filtros
    queryClient.setQueryData(
      clientQueryKeys.all,
      (old: any) => old,  // Invalida silenciosamente
    );

    const newId = String(newClient.id);
    setNewClientId(newId);
    setSelectedClientId(newId);
    backToMain();
  },
  [queryClient, setNewClientId, setSelectedClientId, backToMain],
);

const handleContactCreated = useCallback(
  (response: ClientAndContactResponseCreate<Contact>) => {
    const newContact = response.item;
    const targetClientId = selectedClientId
      ? Number(selectedClientId)
      : newClientId
        ? Number(newClientId)
        : undefined;

    if (targetClientId) {
      // ✅ USA QUERY KEY NORMALIZADA
      queryClient.setQueryData(
        contactQueryKeys.byClient(targetClientId),
        (old: Contact[]) => {
          if (!old) return [newContact];
          return [...old, newContact];
        },
      );

      // ✅ NO INVALIDAR INMEDIATAMENTE - Dejar que se resuelva naturalmente
      // queryClient.invalidateQueries({
      //   queryKey: contactQueryKeys.byClient(targetClientId),
      // });
    }

    setNewContactId(String(newContact.id));
    backToMain();
  },
  [selectedClientId, newClientId, queryClient, setNewContactId, backToMain],
);
```

---

#### Paso 1.5: Actualizar QuoteFlowContainer.tsx

**Archivo:** `src/components/quote/form/QuoteFlowContainer.tsx`

```typescript
import { clientQueryKeys, contactQueryKeys } from "@/lib/queryKeys";

const handleClientCreated = useCallback(
  (newClient: ClienteCreateResponseItem) => {
    // ✅ USA QUERY KEY NORMALIZADA
    queryClient.setQueryData(
      clientQueryKeys.list({ term: "", limit: 10 }),
      (old: PaginatedResponse<ClientListItem>) => {
        if (!old) return { items: [newClient], total: 1 };
        return {
          ...old,
          items: [newClient, ...old.items],
          total: (old.total || 0) + 1,
        };
      },
    );

    const newId = String(newClient.id);
    setNewClientId(newId);
    setSelectedClientId(newId);
    backToMain();
  },
  [queryClient, setNewClientId, setSelectedClientId, backToMain],
);

const handleContactCreated = useCallback(
  (response: ClientAndContactResponseCreate<Contact>) => {
    const newContact = response.item;
    const targetClientId = selectedClientId
      ? Number(selectedClientId)
      : newClientId
        ? Number(newClientId)
        : undefined;

    if (targetClientId) {
      // ✅ USA QUERY KEY NORMALIZADA
      queryClient.setQueryData(
        contactQueryKeys.byClient(targetClientId),
        (old: Contact[]) => {
          if (!old) return [newContact];
          return [...old, newContact];
        },
      );
      
      // ✅ NO INVALIDAR INMEDIATAMENTE
      // queryClient.invalidateQueries({
      //   queryKey: contactQueryKeys.byClient(targetClientId),
      // });
    }

    setNewContactId(String(newContact.id));
    backToMain();
  },
  [selectedClientId, newClientId, queryClient, setNewContactId, backToMain],
);
```

---

### FASE 2: Mejorar Sincronización de Estado Zustand-Cache

**Objetivo:** Garantizar que cuando el estado Zustand cambia, el componente se actualiza correctamente.

#### Paso 2.1: Mejorar ClientSearchSelector.tsx

**Archivo:** `src/components/shared/ClientSearchSelector.tsx`

```typescript
useEffect(() => {
  if (newClientId && clients.length > 0) {
    const newClient = clients.find(
      (c) => String(c.id) === String(newClientId),
    );
    
    if (newClient) {
      // ✅ Cliente encontrado
      onChange(newClientId);
      onClientChange?.(newClientId);
      clearNewClientId();
    } else {
      // ✅ Cliente NO encontrado - Podría estar en otro lugar del caché
      // Log para debugging
      console.warn(
        `⚠️ [ClientSearchSelector] Cliente ${newClientId} no encontrado en búsqueda actual`,
        { searchedIn: clients.length, term: debouncedSearch }
      );
      
      // Verificar si es porque la búsqueda está filtrada
      if (debouncedSearch.length > 0) {
        // El usuario está buscando algo específico, esperar a que borre la búsqueda
        // No limpiar newClientId todavía
      }
    }
  }
}, [newClientId, clients, onChange, onClientChange, clearNewClientId, debouncedSearch]);
```

---

#### Paso 2.2: Mejorar ContactSearchSelector.tsx

**Archivo:** `src/components/shared/ContactSearchSelector.tsx`

```typescript
export function ContactSearchSelector({ 
  value, 
  onChange, 
  clientId, 
  disabled 
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const newContactId = useVisitFlowStore((state) => state.newContactId);
  const clearNewContactId = useVisitFlowStore((state) => state.clearNewContactId);

  // ✅ Usar query hook pero con mejor manejo
  const { contact } = useContactsByClient(clientId);
  const contacts = Array.isArray(contact?.data) ? contact.data : [];
  const isLoading = contact?.isLoading;

  // ✅ MEJORADO: Esperar a que el contacto esté disponible
  useEffect(() => {
    if (newContactId && !isLoading && contacts.length > 0) {
      const newContact = contacts.find(
        (c) => String(c.id) === String(newContactId)
      );
      
      if (newContact) {
        // ✅ Encontrado
        onChange(String(newContactId));
        clearNewContactId();
      } else {
        // ✅ NO encontrado - Esperar un refetch manual
        console.warn(
          `⚠️ [ContactSearchSelector] Contacto ${newContactId} no en caché`,
          { clientId, totalContacts: contacts.length }
        );
      }
    } else if (newContactId && isLoading) {
      // ✅ Aún cargando, esperar
      console.log(
        `⏳ [ContactSearchSelector] Esperando contactos para cliente ${clientId}`
      );
    }
  }, [newContactId, contacts, isLoading, onChange, clearNewContactId]);

  const filteredContacts = contacts.filter((c) => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContact = contacts.find((c) => String(c.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ... resto del componente igual ... */}
    </Popover>
  );
}
```

---

### FASE 3: Remover Race Conditions en Invalidación

**Objetivo:** Evitar que `invalidateQueries` sobrescriba `setQueryData`.

#### Paso 3.1: Actualizar Estrategia en VisitFlowContainer.tsx

**Cambio clave:** Remover `invalidateQueries` después de `setQueryData`

```typescript
const handleContactCreated = useCallback(
  (response: ClientAndContactResponseCreate<Contact>) => {
    const newContact = response.item;
    const targetClientId = selectedClientId
      ? Number(selectedClientId)
      : newClientId
        ? Number(newClientId)
        : undefined;

    if (targetClientId) {
      console.log(
        "✅ [FLOW] Inyectando contacto en caché para cliente:",
        targetClientId,
      );

      queryClient.setQueryData(
        contactQueryKeys.byClient(targetClientId),
        (old: Contact[]) => {
          if (!old) return [newContact];
          console.log({ 
            action: "Contact added to cache",
            newContactCount: old.length + 1 
          });
          return [...old, newContact];
        },
      );

      // ❌ REMOVER ESTO:
      // queryClient.invalidateQueries({
      //   queryKey: contactQueryKeys.byClient(targetClientId),
      // });
      
      // ✅ EN SU LUGAR: Dejar que TanStack Query lo maneje automáticamente
      // El componente usará los datos actualizados directamente
    }

    setNewContactId(String(newContact.id));
    backToMain();
  },
  [selectedClientId, newClientId, queryClient, setNewContactId, backToMain],
);
```

---

#### Paso 3.2: Actualizar useCreateContact Hook

**Archivo:** `src/hooks/client/useContact.ts`

```typescript
import { contactQueryKeys } from "@/lib/queryKeys";

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.createContact,
    onSuccess: (response) => {
      console.log({ 
        action: "Contact created successfully",
        data: response 
      });
      
      // ✅ MEJORADO: Solo invalida, NO setQueryData aquí
      // (FlowContainer ya lo hizo optimistamente)
      queryClient.invalidateQueries({
        queryKey: contactQueryKeys.byClient(response.item.clientId),
      });
      
      // ✅ Invalida también la lista de clientes (para actualizar contador)
      queryClient.invalidateQueries({ 
        queryKey: clientQueryKeys.all 
      });
      
      toast.success("Contacto registrado exitosamente");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || "Error al registrar contacto",
      );
    },
  });
};
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Pre-Implementación
- [ ] Crear backup de archivos críticos
- [ ] Confirmar que los tests existen (si aplica)
- [ ] Familiarizarse con los query keys actuales

### Fase 1: Query Keys Normalizados
- [ ] Crear `src/lib/queryKeys.ts`
- [ ] Actualizar `src/hooks/client/useClient.ts`
- [ ] Actualizar `src/hooks/client/useContact.ts`
- [ ] Actualizar `src/components/shared/ClientSearchSelector.tsx`
- [ ] Actualizar `src/components/shared/ContactSearchSelector.tsx`
- [ ] Actualizar `src/components/visit/VisitFlowContainer.tsx`
- [ ] Actualizar `src/components/quote/form/QuoteFlowContainer.tsx`
- [ ] Verificar que NO haya otros archivos usando hardcoded query keys

### Fase 2: Sincronización Zustand
- [ ] Mejorar lógica de `clearNewClientId()` en ClientSearchSelector
- [ ] Mejorar lógica de `clearNewContactId()` en ContactSearchSelector
- [ ] Agregar logs de debug
- [ ] Verificar que useEffect tiene dependencias correctas

### Fase 3: Remover Race Conditions
- [ ] Remover `invalidateQueries` inmediato después de `setQueryData`
- [ ] Dejar que TanStack Query maneje refetches automáticos
- [ ] Probar la latencia de red (devtools throttle)

### Testing
- [ ] Crear cliente en modal, verificar que aparece en combobox
- [ ] Crear contacto en modal, verificar que aparece en combobox
- [ ] Buscar cliente recién creado, verificar que se encuentra
- [ ] Buscar contacto recién creado, verificar que se encuentra
- [ ] Probar con network latency simulada (lento)
- [ ] Probar en Visit flow
- [ ] Probar en Quote flow
- [ ] Verificar que `clearNewClientId()` y `clearNewContactId()` se ejecutan
- [ ] Abrir DevTools → React Query, verificar que cache keys son consistentes

---

## 🐛 Problemas Secundarios Identificados

### Problema: TypeScript strict mode puede no capturar algunos errores
- **Solución:** Usar `satisfies` operator para validar query keys

### Problema: Otros componentes pueden tener hardcoded query keys
- **Solución:** Buscar regex: `queryKey: \[\s*["']clients["']`

### Problema: Si hay invalidateQueries en onSuccess de mutation
- **Solución:** Confiar en setQueryData en FlowContainer, no en service

---

## 📚 Referencias

- **TanStack Query Docs:** https://tanstack.com/query/latest/docs/react/guides/query-keys
- **Zustand Docs:** https://github.com/pmndrs/zustand
- **Your Codebase:**
  - Hooks: `src/hooks/client/`, `src/hooks/visit/`, `src/hooks/quote/`
  - FlowContainers: `src/components/visit/VisitFlowContainer.tsx`, `src/components/quote/form/QuoteFlowContainer.tsx`
  - Selectors: `src/components/shared/ClientSearchSelector.tsx`, `ContactSearchSelector.tsx`

---

## 🎯 Resultado Esperado Después de Implementar

✅ **Cuando el usuario crea un cliente:**
1. Aparece inmediatamente en el combobox de búsqueda
2. Se selecciona automáticamente
3. `clearNewClientId()` se ejecuta correctamente

✅ **Cuando el usuario crea un contacto:**
1. Aparece inmediatamente en el combobox de búsqueda
2. Se selecciona automáticamente
3. `clearNewContactId()` se ejecuta correctamente
4. No desaparece después (no hay race condition)

✅ **En caso de network latency:**
1. Los datos aparecen de caché (setQueryData optimista)
2. El refetch sucede silenciosamente en background
3. Si el servidor tiene el dato, se valida
4. Si no, el optimista se mantiene

---

**Próximo paso:** ¿Proceder con la implementación? (Responde: `sí`)
