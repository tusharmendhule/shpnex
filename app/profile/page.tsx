// "use client";

// import { useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useRouter } from "next/navigation";
// import Navbar from "../../components/Navbar";
// import { signOut } from "firebase/auth";
// import { auth } from "@/lib/firebase";

// export default function ProfilePage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // 🔒 Protect route
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [user, loading, router]);

//   if (loading || !user) {
//     return <div className="p-10">Loading...</div>;
//   }

//   const logout = async () => {
//     await signOut(auth);
//     router.push("/");
//   };

//   return (
//     <>
//       <Navbar />

//       <main className="min-h-screen bg-gray-100 flex justify-center items-center">

//         <div className="bg-white p-8 rounded-xl shadow w-[420px]">

//           <h1 className="text-2xl font-bold mb-6 text-center">
//             User Profile
//           </h1>

//           <div className="space-y-3">

//             <div>
//               <p className="text-gray-500">Email</p>
//               <p className="font-semibold">
//                 {user.email || "No email"}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-500">User ID</p>
//               <p className="font-semibold break-all">
//                 {user.uid}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-500">Provider</p>
//               <p className="font-semibold">
//                 {user.providerData[0]?.providerId}
//               </p>
//             </div>

//           </div>

//           <button
//             onClick={logout}
//             className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
//           >
//             Logout
//           </button>

//         </div>

//       </main>
//     </>
//   );
// }






"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Package,
  Heart,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔒 Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-10">Loading...</div>;
  }

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // Mock orders (later connect Firestore)
  const orders = [
    {
      id: "ORD-001",
      date: "Feb 5, 2026",
      status: "Delivered",
      total: 299.99,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "Jan 28, 2026",
      status: "In Transit",
      total: 599.98,
      items: 3,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow p-8 mb-8 flex items-center gap-6">

            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.email?.[0].toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {user.displayName || "User"}
              </h1>

              <p className="text-gray-600">{user.email}</p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold"
            >
              <LogOut className="size-5" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <aside className="bg-white rounded-xl shadow overflow-hidden">

              <button className="w-full flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-600 font-semibold">
                <Package className="size-5" />
                My Orders
              </button>

              <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-700">
                <Heart className="size-5" />
                Wishlist
              </button>

              <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-700">
                <Settings className="size-5" />
                Settings
              </button>

            </aside>

            {/* Orders Section */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow p-8">

              <h2 className="text-2xl font-bold mb-6">
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="size-20 text-gray-300 mx-auto mb-4" />

                  <h3 className="text-xl font-semibold mb-2">
                    No orders yet
                  </h3>

                  <button
                    onClick={() => router.push("/shop")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">

                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-6 hover:border-blue-300"
                    >

                      <div className="flex justify-between mb-4">

                        <div>
                          <h3 className="font-semibold">
                            Order {order.id}
                          </h3>

                          <p className="text-sm text-gray-600">
                            {order.date}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">

                        <div>
                          <p className="text-sm text-gray-600">
                            {order.items} items
                          </p>

                          <p className="text-xl font-bold">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                          View Details
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
