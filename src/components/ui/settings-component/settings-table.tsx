import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export type SettingTableColumn = {
  label: string;
  value: string | React.ReactNode;
};

interface SettingTableProps {
  columns?: SettingTableColumn[];
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children?: React.ReactNode; // for extra rows (e.g. 2FA toggle)
}

export function SettingTable({ columns = [], title, subtitle, rightAction, children }: SettingTableProps) {
  return (
    <Card className="w-full max-w-none rounded-xl shadow-sm border border-gray-300">
      {(title || subtitle || rightAction) && (
        <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {rightAction}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {columns.map((column, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[580px_1fr] px-6 py-4 gap-y-1 gap-x-6 items-start"
            >
              <div className="text-gray-600 text-sm font-medium flex-shrink-0">
                {column.label}
              </div>
              <div className="break-words text-gray-900 text-sm">
                {column.value}
              </div>
            </div>
          ))}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
