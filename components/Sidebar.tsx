import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { State } from './dashboard';

interface SidebarProps {
  values: State;
  onValuesChange: (values: State) => void;
  isCollapsed: boolean;
  onCollapse: () => void;
  onReset: () => void;
  maxMonths: number;
}

const labelTranslations: { [key: string]: string } = {
  contentSetupNormal: 'Configuración Contenido Normal',
  contentSetupPremium: 'Configuración Contenido Premium',
  contentMonthlyNormal: 'Mensualidad Contenido Normal',
  contentMonthlyPremium: 'Mensualidad Contenido Premium',
  contentClientsNormal: 'Clientes Contenido Normal',
  contentClientsPremium: 'Clientes Contenido Premium',
  socialSetupNormal: 'Configuración RRSS Normal',
  socialSetupPremium: 'Configuración RRSS Premium',
  socialMonthlyNormal: 'Mensualidad RRSS Normal',
  socialMonthlyPremium: 'Mensualidad RRSS Premium',
  socialClientsNormal: 'Clientes RRSS Normal',
  socialClientsPremium: 'Clientes RRSS Premium',
  growthRate: 'Tasa de Crecimiento',
  commissionRate: 'Tasa de Comisión'
};

const tooltipDescriptions: { [key: string]: string } = {
  contentSetupNormal: 'Costo inicial para configurar el contenido normal',
  contentSetupPremium: 'Costo inicial para configurar el contenido premium',
  contentMonthlyNormal: 'Costo mensual para mantener el contenido normal',
  contentMonthlyPremium: 'Costo mensual para mantener el contenido premium',
  contentClientsNormal: 'Número inicial de clientes de contenido normal',
  contentClientsPremium: 'Número inicial de clientes de contenido premium',
  socialSetupNormal: 'Costo inicial para configurar las redes sociales normales',
  socialSetupPremium: 'Costo inicial para configurar las redes sociales premium',
  socialMonthlyNormal: 'Costo mensual para mantener las redes sociales normales',
  socialMonthlyPremium: 'Costo mensual para mantener las redes sociales premium',
  socialClientsNormal: 'Número inicial de clientes de redes sociales normales',
  socialClientsPremium: 'Número inicial de clientes de redes sociales premium',
  growthRate: 'Tasa de crecimiento mensual de clientes (en porcentaje)',
  commissionRate: 'Porcentaje de comisión sobre los ingresos'
};

const validateInput = (value: number, min: number, max: number): number => {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const groupInputs = () => {
  return {
    content: ['contentSetupNormal', 'contentSetupPremium', 'contentMonthlyNormal', 'contentMonthlyPremium', 'contentClientsNormal', 'contentClientsPremium'],
    social: ['socialSetupNormal', 'socialSetupPremium', 'socialMonthlyNormal', 'socialMonthlyPremium', 'socialClientsNormal', 'socialClientsPremium'],
    rates: ['growthRate', 'commissionRate'],
    simulation: ['months']
  };
};

export function Sidebar({ values, onValuesChange, isCollapsed, onCollapse, onReset, maxMonths }: SidebarProps) {
  const handleInputChange = (key: keyof State, value: number) => {
    let validatedValue: number;
    switch (key) {
      case 'growthRate':
      case 'commissionRate':
        validatedValue = validateInput(value, 0, 100);
        break;
      case 'months':
        validatedValue = validateInput(value, 1, maxMonths);
        break;
      default:
        validatedValue = validateInput(value, 0, 10000);
    }
    onValuesChange({ ...values, [key]: validatedValue });
  };

  const groupedInputs = groupInputs();

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-100 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    } overflow-y-auto z-10`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${isCollapsed ? 'hidden' : ''}`}>Configuración</h2>
          <Button variant="ghost" size="icon" onClick={onCollapse}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        {!isCollapsed && (
          <>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="content">
                <AccordionTrigger>Contenido</AccordionTrigger>
                <AccordionContent>
                  {groupedInputs.content.map((key) => (
                    <div key={key} className="mb-2">
                      <Label 
                        htmlFor={key} 
                        className="text-xs cursor-help" 
                        title={tooltipDescriptions[key]}
                      >
                        {labelTranslations[key]}
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        value={values[key as keyof State]}
                        onChange={(e) => handleInputChange(key as keyof State, parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="social">
                <AccordionTrigger>Social</AccordionTrigger>
                <AccordionContent>
                  {groupedInputs.social.map((key) => (
                    <div key={key} className="mb-2">
                      <Label 
                        htmlFor={key} 
                        className="text-xs cursor-help" 
                        title={tooltipDescriptions[key]}
                      >
                        {labelTranslations[key]}
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        value={values[key as keyof State]}
                        onChange={(e) => handleInputChange(key as keyof State, parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rates">
                <AccordionTrigger>Tasas</AccordionTrigger>
                <AccordionContent>
                  {groupedInputs.rates.map((key) => (
                    <div key={key} className="mb-2">
                      <Label 
                        htmlFor={key} 
                        className="text-xs cursor-help" 
                        title={tooltipDescriptions[key]}
                      >
                        {labelTranslations[key]}
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        value={values[key as keyof State]}
                        onChange={(e) => handleInputChange(key as keyof State, parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="simulation">
                <AccordionTrigger>Simulación</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2">
                    <Label 
                      htmlFor="months" 
                      className="text-xs cursor-help" 
                      title="Número de meses a simular"
                    >
                      Meses de Simulación
                    </Label>
                    <Input
                      id="months"
                      type="number"
                      value={values.months}
                      onChange={(e) => handleInputChange('months', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button className="mt-4 w-full" onClick={onReset}>
              Restablecer valores
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;