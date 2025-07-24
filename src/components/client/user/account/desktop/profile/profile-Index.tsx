"use client"

import AddressBook from "./profile-Address";
import ProfileInfo from "./profile-Info";
import LinkedAccounts from "./profile-LinkAccounts";
import PasswordSection from "./profile-Password";

export default function ProfilePage() {
  return (
    <div className="space-y-4 bg-[#f5f5f7] min-h-screen">
      <ProfileInfo />
      <AddressBook />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordSection />
        <LinkedAccounts />
      </div>
    </div>
  );
}