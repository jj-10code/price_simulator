'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const initialState = {
  contentSetupNormal: 750,
  contentSetupPremium: 1200,
  contentMonthlyNormal: 499,
  contentMonthlyPremium: 799,
  contentClientsNormal: 30,
  contentClientsPremium: 15,
  socialSetupNormal: 900,
  socialSetupPremium: 1500,
  socialMonthlyNormal: 599,
  socialMonthlyPremium: 999,
  socialClientsNormal: 25,
  socialClientsPremium: 10,
  growthRate: 5,
  commissionRate: 50
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num)
}

const formatClients = (num: number) => {
  return Math.round(num)
}

export function DashboardComponent() {
  const [state, setState] = useState(initialState)
  const [tempState, setTempState] = useState(initialState)
  const [results, setResults] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    calculateResults()
  }, [state])

  const handleInputChange = (name: string, value: number) => {
    setTempState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const applyFilters = () => {
    setState(tempState)
  }

  const calculateResults = () => {
    let newResults = []
    let currentContentClientsNormal = state.contentClientsNormal
    let currentContentClientsPremium = state.contentClientsPremium
    let currentSocialClientsNormal = state.socialClientsNormal
    let currentSocialClientsPremium = state.socialClientsPremium

    for (let month = 1; month <= 12; month++) {
      let contentSetupRevenue = (
        (month === 1 ? currentContentClientsNormal * state.contentSetupNormal : 0) +
        (month === 1 ? currentContentClientsPremium * state.contentSetupPremium : 0)
      )
      let contentMonthlyRevenue = currentContentClientsNormal * state.contentMonthlyNormal + 
                                  currentContentClientsPremium * state.contentMonthlyPremium
      let socialSetupRevenue = (
        (month === 1 ? currentSocialClientsNormal * state.socialSetupNormal : 0) +
        (month === 1 ? currentSocialClientsPremium * state.socialSetupPremium : 0)
      )
      let socialMonthlyRevenue = currentSocialClientsNormal * state.socialMonthlyNormal + 
                                 currentSocialClientsPremium * state.socialMonthlyPremium

      let totalRevenue = contentSetupRevenue + contentMonthlyRevenue + socialSetupRevenue + socialMonthlyRevenue
      let commission = totalRevenue * (state.commissionRate / 100)

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
  }

  const totalRevenue = results.reduce((sum, result) => sum + result.totalRevenue, 0)
  const totalCommission = results.reduce((sum, result) => sum + result.commission, 0)
  const averageMonthlyRevenue = totalRevenue / 12
  const finalTotalClients = results.length > 0 ? results[results.length - 1].totalClients : 0
  const finalNormalClients = formatClients(state.contentClientsNormal * Math.pow(1 + state.growthRate / 100, 11) + 
                                           state.socialClientsNormal * Math.pow(1 + state.growthRate / 100, 11))
  const finalPremiumClients = formatClients(state.contentClientsPremium * Math.pow(1 + state.growthRate / 100, 11) + 
                                            state.socialClientsPremium * Math.pow(1 + state.growthRate / 100, 11))

  const InputGroup = ({ label, id, value, onChange }) => {
    let min = 0
    let max = 10000
    let step = 1

    if (id.includes('Monthly')) {
      max = 2000
    } else if (id.includes('Clients')) {
      max = 100
    } else if (id.includes('Rate')) {
      max = 100
      step = 0.1
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}:</Label>
        <Input
          type="number"
          id={id}
          value={value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value)
            if (!isNaN(newValue) && newValue >= min && newValue <= max) {
              onChange(id, newValue)
            }
          }}
          min={min}
          max={max}
          step={step}
        />
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(newValue) => onChange(id, newValue[0])}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className={`bg-card shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-16'}`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-semibold ${isSidebarOpen ? '' : 'sr-only'}`}>Configuración</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        {isSidebarOpen && (
          <ScrollArea className="h-[calc(100vh-8rem)] px-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="content">
                <AccordionTrigger>InspireAI for Content</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <InputGroup label="Setup Normal" id="contentSetupNormal" value={tempState.contentSetupNormal} onChange={handleInputChange} />
                    <InputGroup label="Setup Premium" id="contentSetupPremium" value={tempState.contentSetupPremium} onChange={handleInputChange} />
                    <InputGroup label="Mensual Normal" id="contentMonthlyNormal" value={tempState.contentMonthlyNormal} onChange={handleInputChange} />
                    <InputGroup label="Mensual Premium" id="contentMonthlyPremium" value={tempState.contentMonthlyPremium} onChange={handleInputChange} />
                    <InputGroup label="Clientes Iniciales Normal" id="contentClientsNormal" value={tempState.contentClientsNormal} onChange={handleInputChange} />
                    <InputGroup label="Clientes Iniciales Premium" id="contentClientsPremium" value={tempState.contentClientsPremium} onChange={handleInputChange} />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="social">
                <AccordionTrigger>InspireAI for Social Media</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <InputGroup label="Setup Normal" id="socialSetupNormal" value={tempState.socialSetupNormal} onChange={handleInputChange} />
                    <InputGroup label="Setup Premium" id="socialSetupPremium" value={tempState.socialSetupPremium} onChange={handleInputChange} />
                    <InputGroup label="Mensual Normal" id="socialMonthlyNormal" value={tempState.socialMonthlyNormal} onChange={handleInputChange} />
                    <InputGroup label="Mensual Premium" id="socialMonthlyPremium" value={tempState.socialMonthlyPremium} onChange={handleInputChange} />
                    <InputGroup label="Clientes Iniciales Normal" id="socialClientsNormal" value={tempState.socialClientsNormal} onChange={handleInputChange} />
                    <InputGroup label="Clientes Iniciales Premium" id="socialClientsPremium" value={tempState.socialClientsPremium} onChange={handleInputChange} />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general">
                <AccordionTrigger>Parámetros Generales</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <InputGroup label="Tasa de Crecimiento Mensual (%)" id="growthRate" value={tempState.growthRate} onChange={handleInputChange} />
                    <InputGroup label="Tasa de Comisión (%)" id="commissionRate" value={tempState.commissionRate} onChange={handleInputChange} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        )}
        {isSidebarOpen && (
          <div className="p-4">
            <Button className="w-full" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        )}
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard de Precios InspireAI</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Ingreso Total</CardTitle>
              <CardDescription>(12 meses)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Comisión Total</CardTitle>
              <CardDescription>(12 meses)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(totalCommission)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Ingreso Mensual Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(averageMonthlyRevenue)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Clientes Finales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{formatClients(finalTotalClients)}</p>
                <p className="text-sm text-muted-foreground">Normal: {finalNormalClients}</p>
                <p className="text-sm text-muted-foreground">Premium: {finalPremiumClients}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ingresos y Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000}k €`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value} clientes`} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'totalClients') return [formatClients(value), 'Clientes Totales']
                        return [formatNumber(value), name]
                      }}
                    />
                
                    <Legend />
                    <Bar yAxisId="right" dataKey="totalClients" name="Clientes Totales" fill="#f97316" fillOpacity={0.15} />
                    <Line yAxisId="left" type="monotone" dataKey="contentRevenue" name="Ingresos Content" stroke="#3b82f6" />
                    <Line yAxisId="left" type="monotone" dataKey="socialRevenue" name="Ingresos Social" stroke="#10b981" />
                    <Line yAxisId="left" type="monotone" dataKey="totalRevenue" name="Ingresos Totales" stroke="#8b5cf6" />
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
              <ScrollArea className="h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mes</TableHead>
                      <TableHead>Ingresos Content</TableHead>
                      <TableHead>Ingresos Social</TableHead>
                      <TableHead>Ingresos Totales</TableHead>
                      <TableHead>Comisión</TableHead>
                      <TableHead>Clientes Totales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.month}>
                        <TableCell>{result.month}</TableCell>
                        <TableCell>{formatNumber(result.contentRevenue)}</TableCell>
                        <TableCell>{formatNumber(result.socialRevenue)}</TableCell>
                        <TableCell>{formatNumber(result.totalRevenue)}</TableCell>
                        <TableCell>{formatNumber(result.commission)}</TableCell>
                        <TableCell>{formatClients(result.totalClients)}</TableCell>
                      </TableRow>
                    ))}
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