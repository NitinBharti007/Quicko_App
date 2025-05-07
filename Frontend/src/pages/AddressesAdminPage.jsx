// import React, { useEffect, useState } from "react";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import AxiosToastError from "../utils/AxiosToastError";
// import { useNavigate } from "react-router-dom";

// const AdminAddressPage = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const fetchAllAddresses = async () => {
//     try {
//       setLoading(true);
//       const res = await Axios({ ...SummaryApi.getAllAddressesForAdmin });
//       if (res.data.success) {
//         setAddresses(res.data.data);
//       } else {
//         setError(res.data.message || "Failed to fetch addresses.");
//       }
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//       setError("Failed to fetch addresses. Try again later.");
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/admin/edit-address/${id}`);
//   };

//   useEffect(() => {
//     fetchAllAddresses();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading all addresses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center bg-gray-100">
//         <div>
//           <p className="text-red-600 text-xl font-semibold">{error}</p>
//           <button
//             onClick={fetchAllAddresses}
//             className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 py-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="sticky top-0 bg-gray-100 z-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">User Addresses</h2>
//         </div>

//         {addresses.length === 0 ? (
//           <p className="text-gray-500 text-center">No addresses found.</p>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {addresses.map((address) => (
//               <div
//                 key={address._id}
//                 className="bg-white shadow hover:shadow-lg transition duration-200 rounded-lg border p-5"
//               >
//                 <div className="mb-4">
//                   <h2 className="text-lg font-semibold text-blue-700">
//                     {address?.userId?.name || "User"}{" "}
//                     <span className="text-sm text-gray-600">({address?.userId?.email || "N/A"})</span>
//                   </h2>
//                   {/* <h2>{address?.userId}</h2> */}
//                 </div>
//                 <div className="space-y-2 text-sm text-gray-700">
//                   <p>
//                     <span className="font-medium">Address:</span> {address.address_line}
//                   </p>
//                   <p>
//                     <span className="font-medium">City:</span> {address.city}
//                   </p>
//                   <p>
//                     <span className="font-medium">State:</span> {address.state}
//                   </p>
//                   <p>
//                     <span className="font-medium">Pincode:</span> {address.pincode}
//                   </p>
//                   <p>
//                     <span className="font-medium">Phone:</span> {address.mobile}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAddressPage;


import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";

const AdminAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllAddresses = async () => {
    try {
      setLoading(true);
      const res = await Axios({ ...SummaryApi.getAllAddressesForAdmin });
      if (res.data.success) {
        setAddresses(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch addresses.");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to fetch addresses. Try again later.");
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-address/${id}`);
  };

  useEffect(() => {
    fetchAllAddresses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading all addresses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gray-100 px-4">
        <div>
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <button
            onClick={fetchAllAddresses}
            className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-0 bg-gray-100 z-10 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">User Addresses</h2>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center">No addresses found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white shadow-md hover:shadow-lg transition rounded-lg border p-4 sm:p-5"
              >
                <div className="mb-3">
                  <h2 className="text-base sm:text-lg font-semibold text-blue-700 break-words">
                    {address?.userId?.name || "User"}{" "}
                    <span className="text-sm text-gray-600 break-all">
                      ({address?.userId?.email || "N/A"})
                    </span>
                  </h2>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Address:</span> {address.address_line}
                  </p>
                  <p>
                    <span className="font-medium">City:</span> {address.city}
                  </p>
                  <p>
                    <span className="font-medium">State:</span> {address.state}
                  </p>
                  <p>
                    <span className="font-medium">Pincode:</span> {address.pincode}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {address.mobile}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddressPage;
