'use client'

import React, { useState, useCallback } from 'react'
import Sidebar from './Sidebar'
import { SummaryCard } from './SummaryCard'
import { ResultsTable } from './ResultsTable'
import { RevenueChart } from './RevenueChart'
import { initialConfig } from '../config/initialConfig'
import { useSimulationCalculations } from '../hooks/useSimulationCalculations'

export interface State {
  contentSetupNormal: number;
  contentSetupPremium: number;
  contentMonthlyNormal: number;
  contentMonthlyPremium: number;
  contentClientsNormal: number;
  contentClientsPremium: number;
  socialSetupNormal: number;
  socialSetupPremium: number;
  socialMonthlyNormal: number;
  socialMonthlyPremium: number;
  socialClientsNormal: number;
  socialClientsPremium: number;
  growthRate: number;
  commissionRate: number;
  months: number;
}

export interface Result {
  month: number;
  contentRevenue: number;
  socialRevenue: number;
  totalRevenue: number;
  commission: number;
  totalClients: number;
}

export function DashboardComponent(): JSX.Element {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const {
    state,
    setState,
    memoizedResults,
    summaryCalculations,
    formatCurrency,
    formatNumber,
    formatClientsWithBreakdown
  } = useSimulationCalculations();

  const handleSidebarValuesChange = useCallback((newValues: State) => {
    setState(newValues)
  }, [setState])

  const handleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setState({
      ...initialConfig,
      months: initialConfig.defaultMonths
    })
  }, [setState])

  const {
    totalRevenue,
    totalCommission,
    averageMonthlyRevenue,
    finalTotalClients,
    finalNormalClients,
    finalPremiumClients
  } = summaryCalculations;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        values={state}
        onValuesChange={handleSidebarValuesChange} 
        isCollapsed={isSidebarCollapsed}
        onCollapse={handleSidebarCollapse}
        onReset={handleReset}
        maxMonths={initialConfig.maxMonths}
      />
      <main 
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-16' : 'ml-80'
        }`}
      >
        <div className="p-4 lg:p-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-8">Dashboard de Precios InspireAI</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-8">
            <SummaryCard
              title="Ingreso Total"
              value={formatCurrency(totalRevenue)}
              footerText={`Ingresos acumulados en ${state.months} meses`}
              backgroundColor="bg-blue-100"
            />
            <SummaryCard
              title="Comisión Total"
              value={formatCurrency(totalCommission)}
              footerText={`Comisiones generadas en ${state.months} meses`}
              backgroundColor="bg-green-100"
            />
            <SummaryCard
              title="Ingreso Mensual Promedio"
              value={formatCurrency(averageMonthlyRevenue)}
              footerText="Promedio de ingresos mensuales"
              backgroundColor="bg-yellow-100"
            />
            <SummaryCard
              title="Clientes Finales"
              value={formatNumber(finalTotalClients)}
              footerText={`Normal: ${formatNumber(finalNormalClients)} | Premium: ${formatNumber(finalPremiumClients)}`}
              backgroundColor="bg-pink-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <RevenueChart results={memoizedResults} />
            <ResultsTable 
              results={memoizedResults} 
              state={state} 
              formatCurrency={formatCurrency}
              formatNumber={formatNumber}
              formatClientsWithBreakdown={formatClientsWithBreakdown}
            />
          </div>
        </div>
      </main>
    </div>
  )
}