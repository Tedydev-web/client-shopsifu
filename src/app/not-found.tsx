export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-6 py-12">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-fade-in">
        
        {/* Text Section */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-[140px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 drop-shadow-lg">
            404
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Oops! Trang bạn tìm không tồn tại.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
            Có thể bạn đã nhập sai địa chỉ, hoặc trang này đã được chuyển đi nơi khác. Hãy quay lại trang chủ để tiếp tục mua sắm nhé!
          </p>
          <div className="pt-4">
            <a
              href="/"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Trở về trang chủ
            </a>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center">
          <img
            src="/images/404/404.png"
            alt="Page Not Found"
            className="w-full max-w-md lg:max-w-lg drop-shadow-2xl rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
