import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { State, Result } from './dashboard'

interface ResultsTableProps {
  results: Result[]
  state: State
  formatCurrency: (num: number) => string
  formatNumber: (num: number) => string
  formatClientsWithBreakdown: (total: number, content: number, social: number) => {
    total: number;
    content: number;
    social: number;
  }
}

const ITEMS_PER_PAGE = 12

function ResultsTableComponent({ results, state, formatCurrency, formatNumber, formatClientsWithBreakdown }: ResultsTableProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return results.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [results, currentPage])

  const memoizedTableBody = useMemo(() => (
    <TableBody>
      {paginatedResults.map((result) => {
        const contentClients = state.contentClientsNormal * Math.pow(1 + state.growthRate / 100, result.month - 1) +
                               state.contentClientsPremium * Math.pow(1 + state.growthRate / 100, result.month - 1)
        const socialClients = state.socialClientsNormal * Math.pow(1 + state.growthRate / 100, result.month - 1) +
                              state.socialClientsPremium * Math.pow(1 + state.growthRate / 100, result.month - 1)
        const clientsBreakdown = formatClientsWithBreakdown(result.totalClients, contentClients, socialClients)
        return (
          <TableRow key={result.month} className="h-6">
            <TableCell className="py-1 text-xs">{result.month}</TableCell>
            <TableCell className="py-1 text-xs">{formatCurrency(result.contentRevenue)}</TableCell>
            <TableCell className="py-1 text-xs">{formatCurrency(result.socialRevenue)}</TableCell>
            <TableCell className="py-1 text-xs">{formatCurrency(result.totalRevenue)}</TableCell>
            <TableCell className="py-1 text-xs">{formatCurrency(result.commission)}</TableCell>
            <TableCell className="py-1 text-xs">
              <span>
                {formatNumber(clientsBreakdown.total)}
                <span className="text-gray-400 ml-1">
                  ({formatNumber(clientsBreakdown.content)} - {formatNumber(clientsBreakdown.social)})
                </span>
              </span>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  ), [paginatedResults, state, formatCurrency, formatClientsWithBreakdown])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="py-1 text-xs">Mes</TableHead>
                <TableHead className="py-1 text-xs">Ingresos Content</TableHead>
                <TableHead className="py-1 text-xs">Ingresos Social</TableHead>
                <TableHead className="py-1 text-xs">Ingresos Totales</TableHead>
                <TableHead className="py-1 text-xs">Comisión</TableHead>
                <TableHead className="py-1 text-xs">Clientes Totales</TableHead>
              </TableRow>
            </TableHeader>
            {memoizedTableBody}
          </Table>
        </ScrollArea>
        <div className="flex justify-between items-center mt-4">
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Año Anterior
          </Button>
          <span className="text-sm">
            Año {currentPage} de {totalPages}
          </span>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Año Siguiente <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const ResultsTable = React.memo(ResultsTableComponent)