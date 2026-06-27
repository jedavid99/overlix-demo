import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { RepairPart } from './RepairEdit.types';

interface EditPartsFormProps {
  repuestos: RepairPart[];
  nuevoRepuesto: { nombre: string; cantidad: number; costo_unitario: number };
  setNuevoRepuesto: (repuesto: { nombre: string; cantidad: number; costo_unitario: number }) => void;
  agregarRepuesto: () => void;
  eliminarRepuesto: (id: string) => void;
}

export const EditPartsForm: React.FC<EditPartsFormProps> = ({
  repuestos,
  nuevoRepuesto,
  setNuevoRepuesto,
  agregarRepuesto,
  eliminarRepuesto,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Repuestos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de repuestos */}
        {repuestos.length > 0 && (
          <div className="space-y-2">
            {repuestos.map((repuesto) => (
              <div
                key={repuesto.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{repuesto.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {repuesto.cantidad} x ${repuesto.costo_unitario}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">
                    ${(repuesto.cantidad * repuesto.costo_unitario).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarRepuesto(repuesto.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agregar nuevo repuesto */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Agregar Repuesto</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Nombre del repuesto"
                value={nuevoRepuesto.nombre}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, nombre: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Cantidad"
                value={nuevoRepuesto.cantidad}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, cantidad: parseInt(e.target.value) || 1 })}
                min={1}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Costo unitario"
                value={nuevoRepuesto.costo_unitario}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, costo_unitario: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
              />
            </div>
          </div>
          <Button
            onClick={agregarRepuesto}
            className="mt-3 w-full md:w-auto"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Repuesto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
