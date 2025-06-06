'use client';

import { Header as DesktopHeader } from './desktop/desktop-Index';
import { MobileHeader } from './moblie/moblie-Index';
import { DropdownProvider } from './dropdown-context';

export function Header() {
  return (
    <DropdownProvider>
      <div className="header-container">
        <DesktopHeader />
        <MobileHeader />
      </div>
    </DropdownProvider>
  );
}
