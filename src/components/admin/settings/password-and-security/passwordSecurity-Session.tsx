'use client'

import { SettingTable } from '@/components/ui/settings-component/settings-table'
import { ChevronLeft, Monitor, MoreHorizontal, CheckCircle } from 'lucide-react'
import { sessionMockData } from './passwordSecurity-Mockdata'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

interface PasswordSecuritySessionProps {
  onBack: () => void;
}

export function PasswordSecuritySession({ onBack }: PasswordSecuritySessionProps) {
  const devices = sessionMockData;

  return (
    <SettingTable
      title={
        <Button variant="ghost" className="flex items-center gap-2 p-0 -ml-2 px-2" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
          <span>Thiết bị đăng nhập</span>
        </Button>
      }
      subtitle={`Tổng số ${devices.reduce((total, device) => total + device.sessions.length, 0)} phiên hoạt động trên ${devices.length} thiết bị`}
    >
      <Accordion type="single" collapsible className="w-full">
        {devices.map((device, deviceIndex) => (
          <AccordionItem key={device.deviceId || deviceIndex} value={device.deviceId || `device-${deviceIndex}`}>
            <AccordionTrigger className="flex items-center justify-between gap-4 py-4 px-6 w-full rounded-none hover:bg-gray-50 transition-colors data-[state=open]:border-b data-[state=open]:border-gray-200">
              <div className="flex items-center gap-4">
                <Monitor className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="text-base font-semibold text-gray-900">{device.deviceName}</div>
                  <div className="text-sm text-gray-500">{device.sessions.length} phiên đăng nhập</div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-4">
              <div className="divide-y divide-gray-100">
                {device.sessions.map((session, sessionIndex) => (
                  <div key={session.sessionId || sessionIndex} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{session.deviceName}</div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          {session.isCurrent && <CheckCircle className="w-3 h-3 text-blue-500" />}
                          <span>{session.browser}</span>
                        </div>
                        <div>{session.location}</div>
                        <div>{session.lastActive}</div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 ml-2">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { /* TODO: handle terminate session */ }}>
                            Xóa phiên này
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SettingTable>
  );
}
