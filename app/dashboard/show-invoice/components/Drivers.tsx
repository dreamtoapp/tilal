// SelectDriver.tsx
'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';

interface Driver {
  id: string;
  name: string;
}

interface SelectDriverProps {
  drivers: Driver[];
  selectedDriverId?: string;
  setSelectedDriverId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function Drivers({ drivers, selectedDriverId, setSelectedDriverId }: SelectDriverProps) {
  return (
    <div className="w-full space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon name="User" className="h-4 w-4 text-feature-users" />
        اختيار السائق
      </Label>

      <Select value={selectedDriverId} onValueChange={(value) => setSelectedDriverId(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر السائق المناسب..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Icon name="User" className="h-4 w-4 text-feature-users" />
              السائقون المتاحون
            </SelectLabel>
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <SelectItem
                  key={driver.id}
                  value={driver.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="User" className="h-4 w-4 text-feature-users" />
                    <span>{driver.name}</span>
                    {selectedDriverId === driver.id && (
                      <Icon name="CheckCircle2" className="h-4 w-4 text-green-600 mr-auto" />
                    )}
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-drivers" disabled>
                لا يوجد سائقين متاحين
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedDriverId && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
          <Icon name="CheckCircle2" className="h-3 w-3" />
          تم اختيار: {drivers.find(d => d.id === selectedDriverId)?.name}
        </div>
      )}
    </div>
  );
}
