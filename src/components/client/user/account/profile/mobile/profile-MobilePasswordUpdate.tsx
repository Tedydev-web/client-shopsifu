// "use client";

// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { passwordSchema, type PasswordFormData } from "@/utils/schema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Info, Lock } from "lucide-react";
// import { t } from "i18next";

// interface ChangePasswordModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   userInfo: {
//     name: string;
//     email: string;
//   };
// }

// export function ChangePasswordModal({
//   open,
//   onOpenChange,
//   userInfo,
// }: ChangePasswordModalProps) {
//   const [loading, setLoading] = useState(false);

//   const form = useForm<PasswordFormData>({
//     resolver: zodResolver(passwordSchema),
//     defaultValues: {
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: PasswordFormData) => {
//     setLoading(true);
//     try {
//       // TODO: Call API to change password
//       onOpenChange(false);
//     } catch (error) {
//       // Handle error
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Drawer open={open} onOpenChange={onOpenChange}>
//       <DrawerContent>
//         <div className="h-[100vh] mx-auto w-full max-w-sm">
//           <DrawerHeader>
//             <div className="flex items-center gap-2">
//               <Lock className="w-5 h-5 text-gray-600" />
//               <DrawerTitle className="text-xl font-semibold">
//                 Change Password
//               </DrawerTitle>
//             </div>
//             <DrawerDescription>
//               <div className="mt-2">
//                 <div className="font-medium text-sm">{userInfo.name}</div>
//                 <div className="text-xs text-gray-500">{userInfo.email}</div>
//               </div>
//             </DrawerDescription>
//           </DrawerHeader>

//           <div className="p-6 space-y-6">
//             <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
//               <Info className="w-4 h-4 text-blue-600 shrink-0" />
//               <p className="text-xs text-blue-600">
//                 {t("user.account.address.subtitle")} (!$@%).
//               </p>
//             </div>

//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="currentPassword"
//                   render={({ field }) => (
//                     <FormItem className="space-y-1">
//                       <div className="flex items-center justify-between">
//                         <FormLabel className="text-sm font-medium">
//                           {t("user.account.address.currentPassword")}
//                         </FormLabel>
//                         <a href="#" className="text-xs text-gray-500 hover:underline">
//                           Forget password?
//                         </a>
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           className="text-sm"
//                           placeholder={t("user.account.address.currentPasswordPlaceholder")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="newPassword"
//                   render={({ field }) => (
//                     <FormItem className="space-y-1">
//                       <FormLabel className="text-sm font-medium">
//                         {t("user.account.address.newPassword")}
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           className="text-sm"
//                           placeholder={t("user.account.address.newPasswordPlaceholder")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <p className="text-xs text-gray-500">
//                         Minimum 8 characters required
//                       </p>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem className="space-y-1">
//                       <FormLabel className="text-sm font-medium">
//                         {t("user.account.address.confirmPassword")}
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           className="text-sm"
//                           placeholder={t("user.account.address.newPasswordPlaceholder")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//               </form>
//             </Form>
//           </div>

//           <DrawerFooter className="border-t">
//             <div className="flex justify-end gap-2">
//               <DrawerClose asChild>
//                 <Button variant="outline">
//                   {t("user.account.profile.cancel")}
//                 </Button>
//               </DrawerClose>
//               <Button
//                 onClick={form.handleSubmit(onSubmit)}
//                 className="bg-red-600 text-white"
//                 disabled={loading}
//               >
//                 {loading
//                   ? t("user.account.address.processing")
//                   : t("user.account.address.changePassword")}
//               </Button>
//             </div>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }