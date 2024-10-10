import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Brush, TooltipProps } from 'recharts'
import { Result } from './dashboard'

interface RevenueChartProps {
  results: Result[]
  barColor: string // Nueva propiedad para el color de las barras
}

const formatAxisNumber = (number: number) => {
  if (number >= 1000) {
    return `${(number / 1000).toFixed(0)}K`
  }
  return number.toString()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-4 border border-gray-200 rounded shadow-md">
        <p className="label font-bold">{`Mes ${label}`}</p>
        <p className="intro text-sm text-gray-600 mb-2">Detalles del mes:</p>
        {payload.map((pld, index) => (
          <p key={index} className="text-sm" style={{ color: pld.color }}>
            {`${pld.name || ''}: ${pld.name && pld.name.includes('Clientes') ? Math.round(pld.value as number) : formatCurrency(pld.value as number)}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

/**
 * Componente que muestra un gráfico de evolución de ingresos y clientes.
 * 
 * @param {RevenueChartProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente RevenueChart
 */
function RevenueChartComponent({ results, barColor }: RevenueChartProps): JSX.Element {
  const memoizedChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={results} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          yAxisId="right" 
          dataKey="totalClients" 
          fill={barColor} 
          name="Clientes Totales" 
        />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="totalRevenue" 
          stroke="#ff7300" 
          name="Ingresos Totales" 
          strokeWidth={3}
        />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="commission" 
          stroke="#82ca9d" 
          name="Comisión" 
          strokeWidth={2}
        />
        <Brush dataKey="month" height={30} stroke="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  ), [results, barColor]) // Añadir barColor a las dependencias del useMemo

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de Ingresos y Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]" role="img" aria-label="Gráfico de evolución de ingresos y clientes">
          {memoizedChart}
        </div>
      </CardContent>
    </Card>
  )
}

export const RevenueChart = React.memo(RevenueChartComponent)