import { User, Mail, Phone, Calendar } from "lucide-react";

interface UserInfoCardProps {
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  avatar?: string;
}

export default function DashboardUser({
  name,
  email,
  phone,
  birthday,
  avatar,
}: UserInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-sm flex space-x-4 items-start">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-3 text-gray-700">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <span className="font-medium">Họ và tên:</span>
          <span className="ml-2">{name}</span>
        </div>
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-500" />
          <span className="font-medium">Email:</span>
          <span className="ml-2">{email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-500" />
          <span className="font-medium">Số điện thoại:</span>
          <span className="ml-2">{phone}</span>
        </div>
        {birthday && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">Ngày sinh:</span>
            <span className="ml-2">{birthday}</span>
          </div>
        )}
      </div>
    </div>
  );
}
