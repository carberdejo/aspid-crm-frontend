export const analyticsMockData = [
  {
    id: 1,
    asesor: "Carlo Febres",
    total: {
      visitas: 2,
      entregas: 18,
      cotizado: 116657.77,
      ocPendiente: 23711.84,
      facturado: 21315.04,
      ratio: 0.18,
      cumplimiento: 0.61,
    },
    semanas: [
      // Semana 1: Jueves 01 a Domingo 04 (Incluso si solo son 4 días, se muestra)
      {
        label: "01/01 - 04/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 2: Lunes 05 a Domingo 11
      {
        label: "05/01 - 11/01",
        visitas: 0,
        entregas: 17,
        cotizado: 41741.5,
        ocPendiente: 18976.1,
        facturado: 20993.43,
        ratio: 0.5,
        cumplimiento: 0.6,
      },
      // Semana 3: Lunes 12 a Domingo 18 (Semana muerta, se muestran los ceros)
      {
        label: "12/01 - 18/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 4: Lunes 19 a Domingo 25
      {
        label: "19/01 - 25/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 5: Lunes 26 a Sábado 31 (Termina con el fin de mes)
      {
        label: "26/01 - 31/01",
        visitas: 2,
        entregas: 1,
        cotizado: 74916.27,
        ocPendiente: 23711.84,
        facturado: 21315.04,
        ratio: 0.28,
        cumplimiento: 0.61,
      },
    ],
  },
  // ... (Kevin y Cristian tendrían la misma estructura exacta de 5 semanas en su array)
  {
    id: 2,
    asesor: "Kevin Morales",
    total: {
      visitas: 2,
      entregas: 18,
      cotizado: 116657.77,
      ocPendiente: 23711.84,
      facturado: 21315.04,
      ratio: 0.18,
      cumplimiento: 0.61,
    },
    semanas: [
      // Semana 1: Jueves 01 a Domingo 04 (Incluso si solo son 4 días, se muestra)
      {
        label: "01/01 - 04/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 2: Lunes 05 a Domingo 11
      {
        label: "05/01 - 11/01",
        visitas: 0,
        entregas: 17,
        cotizado: 41741.5,
        ocPendiente: 18976.1,
        facturado: 20993.43,
        ratio: 0.5,
        cumplimiento: 0.6,
      },
      // Semana 3: Lunes 12 a Domingo 18 (Semana muerta, se muestran los ceros)
      {
        label: "12/01 - 18/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 4: Lunes 19 a Domingo 25
      {
        label: "19/01 - 25/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 5: Lunes 26 a Sábado 31 (Termina con el fin de mes)
      {
        label: "26/01 - 31/01",
        visitas: 2,
        entregas: 1,
        cotizado: 74916.27,
        ocPendiente: 23711.84,
        facturado: 21315.04,
        ratio: 0.28,
        cumplimiento: 0.61,
      },
    ],
  },
  {
    id: 3,
    asesor: "Cristian Vásquez",
    total: {
      visitas: 2,
      entregas: 18,
      cotizado: 116657.77,
      ocPendiente: 23711.84,
      facturado: 21315.04,
      ratio: 0.18,
      cumplimiento: 0.61,
    },
    semanas: [
      // Semana 1: Jueves 01 a Domingo 04 (Incluso si solo son 4 días, se muestra)
      {
        label: "01/01 - 04/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 2: Lunes 05 a Domingo 11
      {
        label: "05/01 - 11/01",
        visitas: 0,
        entregas: 17,
        cotizado: 41741.5,
        ocPendiente: 18976.1,
        facturado: 20993.43,
        ratio: 0.5,
        cumplimiento: 0.6,
      },
      // Semana 3: Lunes 12 a Domingo 18 (Semana muerta, se muestran los ceros)
      {
        label: "12/01 - 18/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 4: Lunes 19 a Domingo 25
      {
        label: "19/01 - 25/01",
        visitas: 0,
        entregas: 0,
        cotizado: 0,
        ocPendiente: 0,
        facturado: 0,
        ratio: 0,
        cumplimiento: 0,
      },
      // Semana 5: Lunes 26 a Sábado 31 (Termina con el fin de mes)
      {
        label: "26/01 - 31/01",
        visitas: 2,
        entregas: 1,
        cotizado: 74916.27,
        ocPendiente: 23711.84,
        facturado: 21315.04,
        ratio: 0.28,
        cumplimiento: 0.61,
      },
    ],
  },
];
