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

// Hàm mới để tạo URL slug cho danh mục (giữ nguyên chữ viết hoa và dấu)
export function createCategorySlug(name: string, id: string) {
  // Tạo tên URL-friendly nhưng vẫn giữ nguyên chữ viết hoa và dấu
  const urlFriendlyName = name
    .trim()
    .replace(/\s+/g, '-'); // Chỉ thay khoảng trắng bằng dấu gạch ngang
  
  // Tạo phần không dấu cho URL (không viết hoa)
  const normalizedName = name
    .trim()
    .replace(/\s+/g, '-')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Loại bỏ dấu tiếng Việt
    .replace(/[^\w\-]/g, '')          // Loại bỏ ký tự đặc biệt
    .toLowerCase();
  
  // Tạo slug theo format: /Tên-cat.Id (giữ nguyên tên ban đầu)
  return `/${urlFriendlyName}-cat.${id}`;
}

// Hàm để phân tích slug và trích xuất ID danh mục
export function extractCategoryId(slug: string): string | null {
  // Tìm kiếm pattern "-cat." và lấy ID ở phía sau nó
  const matches = slug.match(/-cat\.([^/]+)$/);
  return matches ? matches[1] : null;
}

// Kiểm tra xem một slug có phải là slug danh mục không
export function isCategorySlug(slug: string): boolean {
  return slug.includes('-cat.');
}