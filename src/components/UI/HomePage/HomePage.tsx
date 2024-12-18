"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Chào mừng đến với hệ thống quản lý nhà xe</h1>
        <p className="text-gray-600 mb-6">
          Quản lý chuyến xe dễ dàng và hiệu quả với hệ thống của chúng tôi.
        </p>

        <Image
                src={"/assets/Artboard.png"}
                alt={"banner"}
                width={800}
                height={800}
                className={` transition-all duration-200  mx-auto mb-10 hidden cursor-pointer rounded-xl lg:flex`}
        />

        {!isAuthenticated && 
          <Link
          className={`mx-2 w-32 p-3 text-center text-sm uppercase bg-orange-600 text-white
    hover:font-bold  border border-black font-bold rounded-xl`}
          href="/auth/signin"
          >
            Đăng nhập
          </Link>
        }
      
      </div>
    </div>
  );
}
