// "use client";

// import { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "../context/AuthContext";

// export default function OrdersPage() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;

//     const fetchOrders = async () => {
//       try {
//         const q = query(
//           collection(db, "orders"),
//           where("userId", "==", user.uid),
//           orderBy("createdAt", "desc")
//         );

//         const snapshot = await getDocs(q);

//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setOrders(data);
//         setLoading(false);

//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   return (
//     <>
//       <Navbar />

//       <main className="bg-gray-50 min-h-screen p-10">

//         <h1 className="text-3xl font-bold mb-8">
//           My Orders
//         </h1>

//         {loading && <p>Loading orders...</p>}

//         {!loading && orders.length === 0 && (
//           <p>No orders found.</p>
//         )}

//         <div className="space-y-6">

//           {orders.map((order: any) => (
//             <div
//               key={order.id}
//               className="bg-white p-6 rounded-xl shadow"
//             >

//               <div className="flex justify-between mb-4">
//                 <p className="font-semibold">
//                   Order ID: {order.id}
//                 </p>

//                 <p className="text-gray-500">
//                   {order.createdAt?.toDate?.().toLocaleString()}
//                 </p>
//               </div>

//               {order.items.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="flex justify-between mb-2"
//                 >
//                   <span>
//                     {item.name} × {item.quantity}
//                   </span>

//                   <span>
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}

//               <hr className="my-3" />

//               <div className="flex justify-between font-bold">
//                 <span>Total</span>
//                 <span>${order.total?.toFixed(2)}</span>
//               </div>

//             </div>
//           ))}

//         </div>

//       </main>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function OrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen p-10">
        <h1 className="text-3xl font-bold mb-8">
          My Orders
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">
            Loading orders...
          </p>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-xl font-semibold mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500">
              Start shopping to see your orders here.
            </p>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate =
              order.createdAt?.seconds
                ? new Date(
                    order.createdAt.seconds * 1000
                  ).toLocaleDateString()
                : "";

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-bold text-lg">
                      Order #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {orderDate}
                    </p>
                  </div>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    Processing
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-gray-700"
                    >
                      <span>
                        {item.name} ×{" "}
                        {item.quantity}
                      </span>
                      <span>
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                {/* Total */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
