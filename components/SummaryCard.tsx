import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

interface SummaryCardProps {
  title: string
  value: string
  footerText: string
  backgroundColor: string
}

/**
 * Componente reutilizable para mostrar tarjetas de resumen en el dashboard.
 * 
 * @param {SummaryCardProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente SummaryCard
 */
export function SummaryCard({ title, value, footerText, backgroundColor }: SummaryCardProps): JSX.Element {
  return (
    <Card className={`${backgroundColor} text-center`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-600 w-full">{footerText}</p>
      </CardFooter>
    </Card>
  )
}