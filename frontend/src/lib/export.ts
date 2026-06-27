/**
 * Utilidad para exportar datos a CSV
 */

export interface ExportData {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Convierte un array de objetos a CSV y lo descarga
 */
export const exportToCSV = (data: ExportData[], filename: string): void => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }

  // Obtener los headers del primer objeto
  const headers = Object.keys(data[0])

  // Crear la fila de headers
  const csvHeaders = headers.join(',')

  // Crear las filas de datos
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header]
        // Manejar valores nulos/undefined
        if (value === null || value === undefined) {
          return ''
        }
        // Escapar comillas y envolver en comillas si contiene comas o comillas
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  // Combinar headers y filas
  const csvContent = [csvHeaders, ...csvRows].join('\n')

  // Crear el Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  // Crear URL y descargar
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Formatea un valor para CSV (escapa caracteres especiales)
 */
export const formatCSVValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}
