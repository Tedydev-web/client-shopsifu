// 'use client';

// import { useBrand } from '../useBrand';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function SearchBrand() {
//   const { data: brands, loading } = useBrand();

//   return (
//     <div className="bg-white rounded-md shadow-sm border p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-red-600 text-sm font-semibold uppercase">Shopee Mall</h2>
//         <Link href="/mall" className="text-sm text-red-500 hover:underline whitespace-nowrap">
//           Xem tất cả &gt;
//         </Link>
//       </div>

//       <div className="overflow-x-auto">
//         <div className="flex gap-4 min-w-max">
//           {(loading ? Array.from({ length: 12 }) : brands.slice(0, 12)).map((brand, i) => {
//             const name = !loading
//               ? brand.brandTranslations?.[0]?.name || brand.name
//               : '';

//             return (
//               <div
//                 key={loading ? i : brand.id}
//                 className="flex items-center justify-center bg-white border rounded-md h-[60px] min-w-[100px] px-4 py-2 hover:shadow shrink-0"
//               >
//                 {loading ? (
//                   <div className="w-full h-full bg-gray-100 animate-pulse rounded-md" />
//                 ) : brand.logo ? (
//                   <Image
//                     src={brand.logo}
//                     alt={name}
//                     width={100}
//                     height={40}
//                     className="object-contain max-h-[40px]"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-600 font-medium text-center">{name}</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
