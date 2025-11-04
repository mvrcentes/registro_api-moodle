"use client"

import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
} from "lucide-react"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  url: string
  className?: string
}

export function PDFViewer({ url, className = "" }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
    setIsLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error)
    setIsLoading(false)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset
      return Math.min(Math.max(1, newPage), numPages)
    })
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0))
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5))
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg ${className}`}>
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between border-b bg-white dark:bg-gray-800 px-4 py-3 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Documento PDF
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Navegación de páginas */}
          <div className="flex items-center gap-1 mr-4 bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-3 min-w-[80px] text-center font-medium">
              {pageNumber} / {numPages || "?"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Controles de zoom */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="h-7 w-7"
              title="Alejar"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 min-w-[50px] text-center font-medium">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="h-7 w-7"
              title="Acercar"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área del visor PDF */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4 min-h-0">
        <div className="flex justify-center items-start min-h-full">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Cargando documento...
              </span>
            </div>
          )}

          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center gap-3 py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Cargando documento...
                </span>
              </div>
            }
            error={
              <div className="flex flex-col items-center gap-3 py-20">
                <FileText className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No se pudo cargar el documento
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Verifica que el archivo sea un PDF válido
                </p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  )
}
