import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

// Importa el tipo initialState desde dashboard.tsx
import { initialState } from './dashboard';

interface SidebarProps {
  onValuesChange: (values: typeof initialState) => void;
  onCollapse: (collapsed: boolean) => void;
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

const Sidebar: React.FC<SidebarProps> = ({ onValuesChange, onCollapse }) => {
  const [values, setValues] = useState<typeof initialState>(initialState);

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  const handleValueChange = (key: string, value: number) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const getInputProps = (key: string) => {
    const min = 0;
    let max = 10000;
    let step = 1;
    let unit = '€';

    if (key.includes('Monthly')) {
      max = 2000;
    } else if (key.includes('Clients')) {
      max = 100;
      unit = '';
    } else if (key.includes('Rate')) {
      max = 100;
      step = 0.1;
      unit = '%';
    }

    return { min, max, step, unit };
  };

  const renderInputs = (keys: string[]) => {
    return keys.map((key) => {
      const { min, max, step, unit } = getInputProps(key);
      return (
        <div key={key} className="space-y-4 mb-6">
          <Label htmlFor={key} className="text-sm font-medium">{labelTranslations[key] || key}</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              id={key}
              value={values[key as keyof typeof values]}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (!isNaN(newValue) && newValue >= min && newValue <= max) {
                  handleValueChange(key, newValue);
                }
              }}
              min={min}
              max={max}
              step={step}
              className="w-24"
            />
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
          <Slider
            min={min}
            max={max}
            step={step}
            value={[values[key as keyof typeof values]]}
            onValueChange={(newValue) => handleValueChange(key, newValue[0])}
            className="mt-2"
          />
        </div>
      );
    });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse(!isCollapsed);
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-gray-100 transition-all duration-300 ease-in-out overflow-y-auto ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <h2 className="text-xl font-bold">Configuración</h2>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          {isCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="content">
              <AccordionTrigger className="text-lg font-semibold">Contenido</AccordionTrigger>
              <AccordionContent className="pt-4">
                {renderInputs([
                  'contentSetupNormal', 'contentSetupPremium', 
                  'contentMonthlyNormal', 'contentMonthlyPremium', 
                  'contentClientsNormal', 'contentClientsPremium'
                ])}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="social">
              <AccordionTrigger className="text-lg font-semibold">Redes Sociales</AccordionTrigger>
              <AccordionContent className="pt-4">
                {renderInputs([
                  'socialSetupNormal', 'socialSetupPremium', 
                  'socialMonthlyNormal', 'socialMonthlyPremium', 
                  'socialClientsNormal', 'socialClientsPremium'
                ])}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="other">
              <AccordionTrigger className="text-lg font-semibold">Otros Parámetros</AccordionTrigger>
              <AccordionContent className="pt-4">
                {renderInputs(['growthRate', 'commissionRate'])}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Sidebar;