import Image from "next/image";

export default function DashboardBanner() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Chương trình nổi bật</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Image
          src="/static/banner-1.jpg"
          alt="Banner 1"
          width={400}
          height={120}
          className="rounded-md w-full object-cover"
        />
        <Image
          src="/static/banner-2.jpg"
          alt="Banner 2"
          width={400}
          height={120}
          className="rounded-md w-full object-cover"
        />
        <Image
          src="/static/banner-3.jpg"
          alt="Banner 3"
          width={400}
          height={120}
          className="rounded-md w-full object-cover"
        />
      </div>
    </div>
  );
}
