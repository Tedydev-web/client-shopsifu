// utils/slugify.ts

// Hàm slugify ban đầu (giữ nguyên)
export function slugify(str: string) {
  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // thay khoảng trắng bằng dấu -
}

// // Hàm mới để tạo URL slug cho danh mục (giữ nguyên chữ viết hoa và dấu)
// export function createCategorySlug(name: string, id: string) {
//   // Tạo tên URL-friendly nhưng vẫn giữ nguyên chữ viết hoa và dấu
//   const urlFriendlyName = name
//     .trim()
//     .replace(/\s+/g, '-'); // Chỉ thay khoảng trắng bằng dấu gạch ngang
  
//   // Tạo phần không dấu cho URL (không viết hoa)
//   const normalizedName = name
//     .trim()
//     .replace(/\s+/g, '-')
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")  // Loại bỏ dấu tiếng Việt
//     .replace(/[^\w\-]/g, '')          // Loại bỏ ký tự đặc biệt
//     .toLowerCase();
  
//   // Tạo slug theo format: /Tên-cat.Id (giữ nguyên tên ban đầu)
//   return `/${urlFriendlyName}-cat.${id}`;
// }

// // Hàm để phân tích slug và trích xuất ID danh mục
// export function extractCategoryId(slug: string): string | null {
//   // Tìm kiếm pattern "-cat." và lấy ID ở phía sau nó
//   const matches = slug.match(/-cat\.([^/]+)$/);
//   return matches ? matches[1] : null;
// }

// // Kiểm tra xem một slug có phải là slug danh mục không
export function isCategorySlug(slug: string): boolean {
  return slug.includes('-cat.');
}

// Cập nhật hàm tạo slug để hỗ trợ nhiều cấp danh mục
export function createCategorySlug(name: string, ids: string[] | string | null | undefined) {
  // Tạo tên URL-friendly nhưng vẫn giữ nguyên chữ viết hoa và dấu
  const urlFriendlyName = name
    .trim()
    .replace(/\s+/g, '-');
  
  // Đảm bảo ids là mảng
  const idsArray = Array.isArray(ids) ? ids : (ids ? [ids] : []);
  
  // Tạo phần ID với format cat.ID1.ID2...
  const idPart = idsArray.length > 0 ? `cat.${idsArray.join('.')}` : '';
  
  // Tạo slug theo format: /Tên-cat.Id1.Id2...
  return `/${urlFriendlyName}-${idPart}`;
}

// Cập nhật hàm trích xuất ID để trả về mảng các ID
export function extractCategoryIds(slug: string): string[] {
  // Tìm kiếm pattern "-cat." và lấy tất cả các ID sau nó
  const matches = slug.match(/-cat\.([^/]+)$/);
  if (!matches || !matches[1]) return [];
  
  // Phân tách các ID bằng dấu chấm
  return matches[1].split('.');
}

// Hàm lấy ID cuối cùng (ID của danh mục hiện tại)
export function extractCurrentCategoryId(slug: string): string | null {
  const ids = extractCategoryIds(slug);
  return ids.length > 0 ? ids[ids.length - 1] : null;
}

// Hàm lấy ID cha (ID đầu tiên)
export function extractParentCategoryId(slug: string): string | null {
  const ids = extractCategoryIds(slug);
  return ids.length > 0 ? ids[0] : null;
}


/**
 * Tạo URL với search params
 * @param pathname - Đường dẫn cơ bản
 * @param params - URLSearchParams hoặc object chứa params
 * @returns URL đầy đủ với params
 */
export function createUrl(
  pathname: string,
  params: URLSearchParams | Record<string, string> = {}
) {
  const searchParams = params instanceof URLSearchParams
    ? params
    : new URLSearchParams(params);
  
  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}