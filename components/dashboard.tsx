'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from './Sidebar'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'

export const initialState = {
  contentSetupNormal: 750,
  contentSetupPremium: 1200,
  contentMonthlyNormal: 300,
  contentMonthlyPremium: 500,
  contentClientsNormal: 3,
  contentClientsPremium: 2,
  socialSetupNormal: 900,
  socialSetupPremium: 1500,
  socialMonthlyNormal: 350,
  socialMonthlyPremium: 550,
  socialClientsNormal: 5,
  socialClientsPremium: 2,
  growthRate: 5,
  commissionRate: 45
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num)
}

const formatClients = (num: number): number => {
  return Math.round(num)
}

interface Result {
  month: number;
  contentRevenue: number;
  socialRevenue: number;
  totalRevenue: number;
  commission: number;
  totalClients: number;
}

const formatNumberES = (num: number): string => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num)
}

const formatClientsWithBreakdown = (total: number, content: number, social: number): JSX.Element => {
  return (
    <span>
      {formatClients(total)}
      <span className="text-gray-400 ml-1">
        ({formatClients(content)} - {formatClients(social)})
      </span>
    </span>
  )
}

export function DashboardComponent() {
  const [state, setState] = useState(initialState)
  const [results, setResults] = useState<Result[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const calculateResults = useCallback(() => {
    const newResults: Result[] = []
    let currentContentClientsNormal = state.contentClientsNormal
    let currentContentClientsPremium = state.contentClientsPremium
    let currentSocialClientsNormal = state.socialClientsNormal
    let currentSocialClientsPremium = state.socialClientsPremium

    for (let month = 1; month <= 12; month++) {
      const contentSetupRevenue = (
        (month === 1 ? currentContentClientsNormal * state.contentSetupNormal : 0) +
        (month === 1 ? currentContentClientsPremium * state.contentSetupPremium : 0)
      )
      const contentMonthlyRevenue = currentContentClientsNormal * state.contentMonthlyNormal + 
                                  currentContentClientsPremium * state.contentMonthlyPremium
      const socialSetupRevenue = (
        (month === 1 ? currentSocialClientsNormal * state.socialSetupNormal : 0) +
        (month === 1 ? currentSocialClientsPremium * state.socialSetupPremium : 0)
      )
      const socialMonthlyRevenue = currentSocialClientsNormal * state.socialMonthlyNormal + 
                                 currentSocialClientsPremium * state.socialMonthlyPremium

      const totalRevenue = contentSetupRevenue + contentMonthlyRevenue + socialSetupRevenue + socialMonthlyRevenue
      const commission = totalRevenue * (state.commissionRate / 100)

      newResults.push({
        month,
        contentRevenue: contentSetupRevenue + contentMonthlyRevenue,
        socialRevenue: socialSetupRevenue + socialMonthlyRevenue,
        totalRevenue,
        commission,
        totalClients: currentContentClientsNormal + currentContentClientsPremium + 
                      currentSocialClientsNormal + currentSocialClientsPremium
      })

      // Apply growth rate for next month
      currentContentClientsNormal *= (1 + state.growthRate / 100)
      currentContentClientsPremium *= (1 + state.growthRate / 100)
      currentSocialClientsNormal *= (1 + state.growthRate / 100)
      currentSocialClientsPremium *= (1 + state.growthRate / 100)
    }

    setResults(newResults)
  }, [state])

  useEffect(() => {
    calculateResults()
  }, [calculateResults])

  const handleSidebarValuesChange = (newValues: typeof initialState) => {
    setState(newValues)
  }

  const totalRevenue = results.reduce((sum, result) => sum + result.totalRevenue, 0)
  const totalCommission = results.reduce((sum, result) => sum + result.commission, 0)
  const averageMonthlyRevenue = totalRevenue / 12
  const finalTotalClients = results.length > 0 ? results[results.length - 1].totalClients : 0
  const finalNormalClients = formatClients(state.contentClientsNormal * Math.pow(1 + state.growthRate / 100, 11) + 
                                           state.socialClientsNormal * Math.pow(1 + state.growthRate / 100, 11))
  const finalPremiumClients = formatClients(state.contentClientsPremium * Math.pow(1 + state.growthRate / 100, 11) + 
                                            state.socialClientsPremium * Math.pow(1 + state.growthRate / 100, 11))

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }

  const formatAxisNumber = (number: number) => {
    if (number >= 1000) {
      return `${(number / 1000).toFixed(0)}K`
    }
    return number.toString()
  }

  return (
    <div className="flex">
      <Sidebar 
        onValuesChange={handleSidebarValuesChange} 
        onCollapse={handleSidebarCollapse}
      />
      <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        <h1 className="text-3xl font-bold mb-8">Dashboard de Precios InspireAI</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-100 text-center">
            <CardHeader>
              <CardTitle>Ingreso Total</CardTitle>
              <CardDescription>(12 meses)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(totalRevenue)}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-600 w-full">Ingresos acumulados en el último año</p>
            </CardFooter>
          </Card>
          <Card className="bg-green-100 text-center">
            <CardHeader>
              <CardTitle>Comisión Total</CardTitle>
              <CardDescription>(12 meses)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(totalCommission)}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-600 w-full">Comisiones generadas en el último año</p>
            </CardFooter>
          </Card>
          <Card className="bg-yellow-100 text-center">
            <CardHeader>
              <CardTitle>Ingreso Mensual Promedio</CardTitle>
              <CardDescription>&nbsp;</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(averageMonthlyRevenue)}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-600 w-full">Promedio de ingresos mensuales</p>
            </CardFooter>
          </Card>
          <Card className="bg-pink-100 text-center">
            <CardHeader>
              <CardTitle>Clientes Finales</CardTitle>
              <CardDescription>&nbsp;</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatClients(finalTotalClients)}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-600 w-full">
                Normal: {finalNormalClients} | Premium: {finalPremiumClients}
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ingresos y Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      yAxisId="left" 
                      tickFormatter={formatAxisNumber}
                      tick={{fontSize: 12}}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tickFormatter={formatAxisNumber}
                      tick={{fontSize: 12}}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="right" dataKey="totalClients" fill="#8884d8" name="Clientes Totales" />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="totalRevenue" 
                      stroke="#ff7300" 
                      name="Ingresos Totales" 
                      strokeWidth={3}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

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
                  <TableBody>
                    {results.map((result) => {
                      const contentClients = state.contentClientsNormal * Math.pow(1 + state.growthRate / 100, result.month - 1) +
                                             state.contentClientsPremium * Math.pow(1 + state.growthRate / 100, result.month - 1)
                      const socialClients = state.socialClientsNormal * Math.pow(1 + state.growthRate / 100, result.month - 1) +
                                            state.socialClientsPremium * Math.pow(1 + state.growthRate / 100, result.month - 1)
                      return (
                        <TableRow key={result.month} className="h-6">
                          <TableCell className="py-1 text-xs">{result.month}</TableCell>
                          <TableCell className="py-1 text-xs">{formatNumberES(result.contentRevenue)}</TableCell>
                          <TableCell className="py-1 text-xs">{formatNumberES(result.socialRevenue)}</TableCell>
                          <TableCell className="py-1 text-xs">{formatNumberES(result.totalRevenue)}</TableCell>
                          <TableCell className="py-1 text-xs">{formatNumberES(result.commission)}</TableCell>
                          <TableCell className="py-1 text-xs">
                            {formatClientsWithBreakdown(result.totalClients, contentClients, socialClients)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}