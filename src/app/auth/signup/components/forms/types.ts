// ====== Tipos base ======
type Option<T extends string> = { value: T; label: string }

// #regionAnexo 3
type EtniaValue =
  | "MAYA"
  | "XINCA"
  | "GARIFUNA"
  | "LADINOS"
  | "EXTRANJERO"
  | "OTRA"
type EtniaOption = { value: EtniaValue; label: string }

export const ETNIA_OPTIONS: EtniaOption[] = [
  { value: "MAYA", label: "Maya" },
  { value: "XINCA", label: "Xinca" },
  { value: "GARIFUNA", label: "Garífuna" },
  { value: "LADINOS", label: "Ladinos" },
  { value: "EXTRANJERO", label: "Extranjero" },
  { value: "OTRA", label: "Otra" },
]
// #endregion Anexo 3

// =======================
// #region Anexo 4 – Sector al que pertenece
// =======================
export type SectorValue =
  | "CGC"
  | "SOCIEDAD_CIVIL"
  | "FIDEICOMISOS"
  | "DEFENSA_SEGURIDAD_JUSTICIA"
  | "ECONOMIA_FINANZAS_TRABAJO_PREVISION"
  | "EDUCACION_CIENCIA_CULTURA_DEPORTES"
  | "GOBIERNOS_LOCALES_Y_CONSEJOS"
  | "MEDIO_AMBIENTE_Y_RECURSOS_NATURALES"
  | "ORGANISMOS_E_INSTITUCIONES_APOYO"
  | "SALUD_Y_SEGURIDAD_SOCIAL"

export const SECTOR_OPTIONS: Option<SectorValue>[] = [
  { value: "CGC", label: "Contraloría General de Cuentas" },
  { value: "SOCIEDAD_CIVIL", label: "Sociedad Civil" },
  { value: "FIDEICOMISOS", label: "Sector Fideicomisos" },
  {
    value: "DEFENSA_SEGURIDAD_JUSTICIA",
    label: "Sector Defensa, Seguridad y Justicia",
  },
  {
    value: "ECONOMIA_FINANZAS_TRABAJO_PREVISION",
    label: "Sector Economía, Finanzas, Trabajo y Previsión Social",
  },
  {
    value: "EDUCACION_CIENCIA_CULTURA_DEPORTES",
    label: "Sector Educación, Ciencia, Cultura y Deportes",
  },
  {
    value: "GOBIERNOS_LOCALES_Y_CONSEJOS",
    label: "Sector Gobiernos Locales y Consejos de Desarrollo",
  },
  {
    value: "MEDIO_AMBIENTE_Y_RECURSOS_NATURALES",
    label: "Sector Medio Ambiente y Recursos Naturales",
  },
  {
    value: "ORGANISMOS_E_INSTITUCIONES_APOYO",
    label: "Sector Organismos e Instituciones de Apoyo",
  },
  {
    value: "SALUD_Y_SEGURIDAD_SOCIAL",
    label: "Sector Salud y Seguridad Social",
  },
]

// =======================
// #region Anexo 5 – Institución a la que pertenece
// =======================
export type InstitucionValue =
  | "NO_APLICA"
  | "ALMG"
  | "ANADIE"
  | "CVB"
  | "CNEE"
  | "COG"
  | "CONGRESO"
  | "CNA"
  | "CONADI"
  | "CGC"
  | "CONRED"
  | "CC"
  | "EMPAGUA"
  | "EPN_STC"
  | "ENCA"
  | "FNA"
  | "IDPP"
  | "INGUAT"
  | "INAP"
  | "INAB"
  | "INTECAP"
  | "MANCOMUNIDAD_CONO_SUR_JUTIAPA"
  | "MSPAS"
  | "MINEDUC"
  | "MINGOB"
  | "MUNI_GUATEMALA"
  | "PDH"
  | "RGP"
  | "RENAP"
  | "SAT"
  | "TSE"
  | "USAC"
  | "IGSS"

export const INSTITUCION_OPTIONS: Option<InstitucionValue>[] = [
  { value: "NO_APLICA", label: "NO APLICA" },
  { value: "ALMG", label: "Academia de Lenguas Mayas de Guatemala" },
  {
    value: "ANADIE",
    label:
      "Agencia Nacional de Alianza para el Desarrollo de Infraestructura Económica (ANADIE)",
  },
  {
    value: "CVB",
    label: "Benemérito Cuerpo Voluntario de Bomberos de Guatemala (CVB)",
  },
  { value: "CNEE", label: "Comisión Nacional de Energía Eléctrica" },
  { value: "COG", label: "Comité Olímpico Guatemalteco (COG)" },
  { value: "CONGRESO", label: "Congreso de la República de Guatemala" },
  { value: "CNA", label: "Consejo Nacional de Adopciones (CNA)" },
  {
    value: "CONADI",
    label:
      "Consejo Nacional para la Atención de las Personas con Discapacidad (CONADI)",
  },
  { value: "CGC", label: "Contraloría General de Cuentas" },
  {
    value: "CONRED",
    label: "Coordinadora Nacional para la Reducción de Desastres (CONRED)",
  },
  { value: "CC", label: "Corte de Constitucionalidad" },
  { value: "EMPAGUA", label: "Empresa Municipal de Agua – EMPAGUA" },
  {
    value: "EPN_STC",
    label: "Empresa Portuaria Nacional Santo Tomás de Castilla",
  },
  { value: "ENCA", label: "Escuela Nacional Central de Agricultura (ENCA)" },
  { value: "FNA", label: "Federación Nacional de Ajedrez de Guatemala" },
  { value: "IDPP", label: "Instituto de la Defensa Pública Penal (IDPP)" },
  { value: "INGUAT", label: "Instituto Guatemalteco de Turismo (INGUAT)" },
  {
    value: "INAP",
    label: "Instituto Nacional de Administración Pública (INAP)",
  },
  { value: "INAB", label: "Instituto Nacional de Bosques (INAB)" },
  {
    value: "INTECAP",
    label: "Instituto Técnico de Capacitación y Productividad (INTECAP)",
  },
  {
    value: "MANCOMUNIDAD_CONO_SUR_JUTIAPA",
    label: "Mancomunidad de Municipios del Cono Sur Jutiapa",
  },
  { value: "MSPAS", label: "Ministerio de Salud Pública y Asistencia Social" },
  { value: "MINEDUC", label: "Ministerio de Educación" },
  { value: "MINGOB", label: "Ministerio de Gobernación" },
  { value: "MUNI_GUATEMALA", label: "Municipalidad de Guatemala" },
  { value: "PDH", label: "Procuraduría de los Derechos Humanos (PDH)" },
  { value: "RGP", label: "Registro General de la Propiedad (RGP)" },
  { value: "RENAP", label: "Registro Nacional de las Personas (RENAP)" },
  {
    value: "SAT",
    label: "Superintendencia de Administración Tributaria (SAT)",
  },
  { value: "TSE", label: "Tribunal Supremo Electoral (TSE)" },
  { value: "USAC", label: "Universidad de San Carlos de Guatemala (USAC)" },
  { value: "IGSS", label: "Instituto Guatemalteco de Seguridad Social (IGSS)" },
]

// =======================
// #region Anexo 6 – Ubicación administrativa (visible solo si INSTITUCIÓN = CGC)
// =======================
export type UbicacionCGCValue =
  | "NO_APLICA"
  | "DESPACHO_GENERAL"
  | "SUB_POBRIDAD"
  | "SUB_CALIDAD_GASTO"
  | "SUB_ADMINISTRATIVA"
  | "INSPECCION_GENERAL"
  | "SECRETARIA_GENERAL"
  | "DAI"
  | "DAJ"
  | "DSI"
  | "DTSA"
  | "DCOM"
  | "DPROBIDAD"
  | "DCVI"
  | "DDELEGACIONES"
  | "DA_SALUD"
  | "DA_EDUCACION"
  | "DA_DEFENSA"
  | "DA_AMBIENTE"
  | "DA_ECONOMIA"
  | "DA_COMUNICACIONES"
  | "DA_MUNICIPALIDADES"
  | "DA_ORGANISMOS_APOYO"
  | "DA_FIDEICOMISOS"
  | "DA_OBRA_PUBLICA"
  | "DA_SISTEMAS_NOMINAS"
  | "DA_DENUNCIAS"
  | "DAC_AUDITORIA"
  | "D_ANALISIS_GESTION"
  | "D_CONTRA_REVISIONES"
  | "DA_PUEBLOS_INDIGENAS_VULNERABLES"
  | "D_ADMINISTRATIVA"
  | "D_FINANCIERA"
  | "D_RRHH"
  | "D_PLANIFICACION"
  | "D_TIC"
  | "D_FORMACION_CAPACITACION"
  | "D_COOPERACION_RRII"
  | "D_DELEGACIONES_2"
  | "D_FORT_CONTROL_INTERNO_UDAI"
  | "DA_DESEMPENO"

export const UBICACION_CGC_OPTIONS: Option<UbicacionCGCValue>[] = [
  { value: "NO_APLICA", label: "NO APLICA" },
  { value: "DESPACHO_GENERAL", label: "Despacho General" },
  { value: "SUB_POBRIDAD", label: "Subcontraloría de Probidad" },
  {
    value: "SUB_CALIDAD_GASTO",
    label: "Subcontraloría de Calidad de Gasto Público",
  },
  { value: "SUB_ADMINISTRATIVA", label: "Subcontraloría Administrativa" },
  { value: "INSPECCION_GENERAL", label: "Inspección General" },
  { value: "SECRETARIA_GENERAL", label: "Secretaría General" },
  { value: "DAI", label: "Dirección de Auditoría Interna" },
  { value: "DAJ", label: "Dirección de Asuntos Jurídicos" },
  { value: "DSI", label: "Dirección de Seguridad Integral" },
  { value: "DTSA", label: "Dirección Técnica Sectorial de Auditoría" },
  { value: "DCOM", label: "Dirección de Comunicación" },
  { value: "DPROBIDAD", label: "Dirección de Probidad" },
  {
    value: "DCVI",
    label: "Dirección de Control y Verificación Interinstitucional",
  },
  {
    value: "DDELEGACIONES",
    label: "Dirección de Delegaciones Departamentales",
  },
  {
    value: "DA_SALUD",
    label: "Dirección de Auditoría al Sector Salud y Seguridad Social",
  },
  {
    value: "DA_EDUCACION",
    label:
      "Dirección de Auditoría al Sector Educación, Ciencia, Cultura y Deportes",
  },
  {
    value: "DA_DEFENSA",
    label: "Dirección de Auditoría al Sector Defensa, Seguridad y Justicia",
  },
  {
    value: "DA_AMBIENTE",
    label:
      "Dirección de Auditoría al Sector Medio Ambiente y Recursos Naturales",
  },
  {
    value: "DA_ECONOMIA",
    label:
      "Dirección de Auditoría al Sector Economía, Finanzas, Trabajo y Previsión Social",
  },
  {
    value: "DA_COMUNICACIONES",
    label:
      "Dirección de Auditoría al Sector Comunicaciones, Infraestructura Pública y Vivienda",
  },
  {
    value: "DA_MUNICIPALIDADES",
    label:
      "Dirección de Auditoría al Sector Municipalidades y Consejos de Desarrollo",
  },
  {
    value: "DA_ORGANISMOS_APOYO",
    label:
      "Dirección de Auditoría al Sector Organismos e Instituciones de Apoyo",
  },
  { value: "DA_FIDEICOMISOS", label: "Dirección de Auditoría a Fideicomisos" },
  {
    value: "DA_OBRA_PUBLICA",
    label: "Dirección de Auditoría a Obra Pública y Gestión Ambiental",
  },
  {
    value: "DA_SISTEMAS_NOMINAS",
    label:
      "Dirección de Auditoría a Sistemas Informáticos y Nóminas de Gobierno",
  },
  {
    value: "DA_DENUNCIAS",
    label: "Dirección de Auditoría para Atención a Denuncias",
  },
  {
    value: "DAC_AUDITORIA",
    label: "Dirección de Aseguramiento de la Calidad de Auditoría",
  },
  {
    value: "D_ANALISIS_GESTION",
    label:
      "Dirección de Análisis de la Gestión Pública, Monitoreo y Alerta Temprana",
  },
  { value: "D_CONTRA_REVISIONES", label: "Dirección de Contra Revisiones" },
  {
    value: "DA_PUEBLOS_INDIGENAS_VULNERABLES",
    label:
      "Dirección de Auditoría a Recursos Públicos destinados a Pueblos Indígenas y Pueblos Vulnerables",
  },
  { value: "D_ADMINISTRATIVA", label: "Dirección Administrativa" },
  { value: "D_FINANCIERA", label: "Dirección Financiera" },
  { value: "D_RRHH", label: "Dirección de Recursos Humanos" },
  { value: "D_PLANIFICACION", label: "Dirección de Planificación" },
  {
    value: "D_TIC",
    label: "Dirección de Tecnologías de la Información y Comunicación",
  },
  {
    value: "D_FORMACION_CAPACITACION",
    label:
      "Dirección de Formación y Capacitación en Fiscalización y de Control Gubernamental",
  },
  {
    value: "D_COOPERACION_RRII",
    label: "Dirección de Cooperación y Relaciones Interinstitucionales",
  },
  {
    value: "D_DELEGACIONES_2",
    label: "Dirección de Delegaciones Departamentales (duplicada de la 14)",
  },
  {
    value: "D_FORT_CONTROL_INTERNO_UDAI",
    label:
      "Dirección de Fortalecimiento al Control Interno y de Gestión de las Unidades de Auditoría Interna – UDAI",
  },
  { value: "DA_DESEMPENO", label: "Dirección de Auditoría de Desempeño" },
]

// =======================
// #region Anexo 7 – Renglón presupuestario
// =======================
export type RenglonValue =
  | "011_PERSONAL_PERMANENTE"
  | "029_GRUPO"
  | "SUBGRUPO_18_022"
  | "NO_APLICA"
  | "021_RENGLON"

export const RENGLON_OPTIONS: Option<RenglonValue>[] = [
  { value: "011_PERSONAL_PERMANENTE", label: "Personal Permanente (011)" },
  { value: "029_GRUPO", label: "Grupo (029)" },
  { value: "SUBGRUPO_18_022", label: "Subgrupo 18 y 022" },
  { value: "NO_APLICA", label: "NO APLICA" },
  { value: "021_RENGLON", label: "Renglón 021" },
]

// =======================
// #region Anexo 8 – Colegios profesionales
// =======================
export type ColegioValue =
  | "NO_APLICA"
  | "HUMANIDADES"
  | "ARQUITECTOS"
  | "CPA"
  | "CCEE"
  | "COFAQUI"
  | "CIAG"
  | "CIG"
  | "CIQ"
  | "CMVZ"
  | "COLMED"
  | "PSICOLOGOS"
  | "ESTOMATOLOGICO"
  | "CANG"
  | "ENFERMERIA"

export const COLEGIO_OPTIONS: Option<ColegioValue>[] = [
  { value: "NO_APLICA", label: "NO APLICA" },
  {
    value: "HUMANIDADES",
    label: "Colegio Profesional de Humanidades de Guatemala",
  },
  { value: "ARQUITECTOS", label: "Colegio de Arquitectos de Guatemala" },
  {
    value: "CPA",
    label: "Colegio de Contadores Públicos y Auditores de Guatemala (CPA)",
  },
  {
    value: "CCEE",
    label:
      "Colegio de Economistas, Contadores Públicos y Auditores y Administradores de Empresas (CCEE)",
  },
  {
    value: "COFAQUI",
    label: "Colegio de Farmacéuticos y Químicos de Guatemala (COFAQUI)",
  },
  {
    value: "CIAG",
    label: "Colegio de Ingenieros Agrónomos de Guatemala (CIAG)",
  },
  { value: "CIG", label: "Colegio de Ingenieros de Guatemala (CIG)" },
  { value: "CIQ", label: "Colegio de Ingenieros Químicos de Guatemala (CIQ)" },
  {
    value: "CMVZ",
    label: "Colegio de Médicos Veterinarios y Zootecnistas de Guatemala (CMVZ)",
  },
  {
    value: "COLMED",
    label: "Colegio de Médicos y Cirujanos de Guatemala (COLMED)",
  },
  { value: "PSICOLOGOS", label: "Colegio de Psicólogos de Guatemala" },
  {
    value: "ESTOMATOLOGICO",
    label: "Colegio Estomatológico de Guatemala (CEG)",
  },
  {
    value: "CANG",
    label: "Colegio de Abogados y Notarios de Guatemala (CANG)",
  },
  {
    value: "ENFERMERIA",
    label: "Colegio Profesional de Enfermería de Guatemala",
  },
]

// =============== Helpers opcionales ===============
// Derivar el tipo literal desde las opciones, si prefieres:
// export type SectorValue = typeof SECTOR_OPTIONS[number]["value"]
