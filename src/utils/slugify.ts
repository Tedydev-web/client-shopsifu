// utils/slugify.ts
export function slugify(str: string) {
  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // thay khoảng trắng bằng dấu -
}
