'use client';

import { useState } from 'react';
import { useAvailableTechnicians } from '../hooks/use-work-orders';
import { Technician } from '../types/work-order.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Phone,
  CheckCircle,
  Search,
  UserPlus,
  X,
} from 'lucide-react';

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId: string;
  onAssign: (technicianId: string, scheduledDate?: string) => void;
  isPending?: boolean;
}

export function AssignTechnicianDialog({
  open,
  onOpenChange,
  workOrderId,
  onAssign,
  isPending,
}: AssignTechnicianDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');

  const { data: technicians, isLoading } = useAvailableTechnicians(scheduledDate);

  const filteredTechnicians = (technicians || []).filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedTechnician) {
      onAssign(selectedTechnician.id, scheduledDate);
      setSelectedTechnician(null);
      setSearchQuery('');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedTechnician(null);
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Asignar Técnico
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Fecha del servicio</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar técnico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {selectedTechnician && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedTechnician.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTechnician.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedTechnician(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Técnicos disponibles</Label>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredTechnicians.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay técnicos disponibles</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-auto">
                {filteredTechnicians.map((technician) => (
                  <div
                    key={technician.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTechnician?.id === technician.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTechnician(technician)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{technician.name}</p>
                          {technician.status === 'available' && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Disponible
                            </span>
                          )}
                        </div>
                        {technician.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {technician.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!selectedTechnician || isPending}>
            {isPending ? 'Asignando...' : 'Asignar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
