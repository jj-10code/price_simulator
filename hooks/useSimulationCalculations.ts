import { useState, useMemo, useCallback } from 'react';
import { State } from '../components/dashboard';
import { initialConfig } from '../config/initialConfig';

// Actualiza la interfaz Result para incluir clientsBreakdown
interface Result {
  month: number;
  contentRevenue: number;
  socialRevenue: number;
  totalRevenue: number;
  commission: number;
  totalClients: number;
  clientsBreakdown: {
    contentNormal: number;
    contentPremium: number;
    socialNormal: number;
    socialPremium: number;
  };
}

interface ClientType {
  currentClients: number;
  cumulativeFraction: number;
  setupFee: number;
  monthlyFee: number;
}

const formatClients = (num: number): number => {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.max(0, Math.round(num));
}

const calculateNewClients = (clientType: ClientType, growthRate: number): number => {
  const expectedGrowth = clientType.currentClients * (growthRate / 100);
  clientType.cumulativeFraction += expectedGrowth;
  const newClients = Math.floor(clientType.cumulativeFraction);
  clientType.cumulativeFraction -= newClients;
  clientType.currentClients += newClients;
  return newClients;
}

export const useSimulationCalculations = () => {
  const [state, setState] = useState<State>({
    ...initialConfig,
    months: initialConfig.defaultMonths
  });

  const calculateResults = useCallback((currentState: State): Result[] => {
    const results: Result[] = [];
    const contentNormal: ClientType = {
      currentClients: currentState.contentClientsNormal,
      cumulativeFraction: 0,
      setupFee: currentState.contentSetupNormal,
      monthlyFee: currentState.contentMonthlyNormal,
    };
    const contentPremium: ClientType = {
      currentClients: currentState.contentClientsPremium,
      cumulativeFraction: 0,
      setupFee: currentState.contentSetupPremium,
      monthlyFee: currentState.contentMonthlyPremium,
    };
    const socialNormal: ClientType = {
      currentClients: currentState.socialClientsNormal,
      cumulativeFraction: 0,
      setupFee: currentState.socialSetupNormal,
      monthlyFee: currentState.socialMonthlyNormal,
    };
    const socialPremium: ClientType = {
      currentClients: currentState.socialClientsPremium,
      cumulativeFraction: 0,
      setupFee: currentState.socialSetupPremium,
      monthlyFee: currentState.socialMonthlyPremium,
    };

    for (let month = 1; month <= currentState.months; month++) {
      const newContentNormalClients = calculateNewClients(contentNormal, currentState.growthRate);
      const newContentPremiumClients = calculateNewClients(contentPremium, currentState.growthRate);
      const newSocialNormalClients = calculateNewClients(socialNormal, currentState.growthRate);
      const newSocialPremiumClients = calculateNewClients(socialPremium, currentState.growthRate);

      const contentSetupRevenue = 
        newContentNormalClients * contentNormal.setupFee + 
        newContentPremiumClients * contentPremium.setupFee;
      const socialSetupRevenue = 
        newSocialNormalClients * socialNormal.setupFee + 
        newSocialPremiumClients * socialPremium.setupFee;

      const contentMonthlyRevenue = 
        contentNormal.currentClients * contentNormal.monthlyFee + 
        contentPremium.currentClients * contentPremium.monthlyFee;
      const socialMonthlyRevenue = 
        socialNormal.currentClients * socialNormal.monthlyFee + 
        socialPremium.currentClients * socialPremium.monthlyFee;

      const contentRevenue = contentSetupRevenue + contentMonthlyRevenue;
      const socialRevenue = socialSetupRevenue + socialMonthlyRevenue;
      const totalRevenue = contentRevenue + socialRevenue;
      const commission = totalRevenue * (currentState.commissionRate / 100);

      results.push({
        month,
        contentRevenue,
        socialRevenue,
        totalRevenue,
        commission,
        totalClients: contentNormal.currentClients + contentPremium.currentClients + 
                      socialNormal.currentClients + socialPremium.currentClients,
        clientsBreakdown: {
          contentNormal: contentNormal.currentClients,
          contentPremium: contentPremium.currentClients,
          socialNormal: socialNormal.currentClients,
          socialPremium: socialPremium.currentClients,
        },
      });
    }

    return results;
  }, []);

  const memoizedResults = useMemo(() => calculateResults(state), [calculateResults, state]);

  const summaryCalculations = useMemo(() => {
    const totalRev = memoizedResults.reduce((sum, result) => sum + result.totalRevenue, 0);
    const totalComm = memoizedResults.reduce((sum, result) => sum + result.commission, 0);
    const avgMonthlyRev = totalRev / state.months;
    const finalResult = memoizedResults[memoizedResults.length - 1];
    
    return {
      totalRevenue: totalRev,
      totalCommission: totalComm,
      averageMonthlyRevenue: avgMonthlyRev,
      finalTotalClients: finalResult.totalClients,
      finalNormalClients: finalResult.clientsBreakdown.contentNormal + finalResult.clientsBreakdown.socialNormal,
      finalPremiumClients: finalResult.clientsBreakdown.contentPremium + finalResult.clientsBreakdown.socialPremium
    };
  }, [memoizedResults, state.months]);

  const formatNumber = useCallback((num: number): string => {
    if (isNaN(num) || !isFinite(num)) return '0';
    return Math.round(num).toString();
  }, []);

  const formatCurrency = useCallback((num: number): string => {
    if (isNaN(num) || !isFinite(num)) return '0 €';
    const roundedNum = Math.round(num);
    if (roundedNum < 10000) {
      return `${roundedNum} €`;
    }
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(roundedNum);
  }, []);

  const formatClientsWithBreakdown = useCallback((total: number, content: number, social: number) => {
    return {
      total: formatClients(total),
      content: formatClients(content),
      social: formatClients(social)
    };
  }, []);

  return {
    state,
    setState,
    memoizedResults,
    summaryCalculations,
    formatCurrency,
    formatNumber,
    formatClientsWithBreakdown
  };
};