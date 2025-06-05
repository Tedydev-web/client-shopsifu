'use client';

import { Header as DesktopHeader } from './header-Desktop';
import { MobileHeader } from './header-Mobile';
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
