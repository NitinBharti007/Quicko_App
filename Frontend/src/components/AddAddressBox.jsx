// import React, { useEffect, useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { useForm } from "react-hook-form";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import AxiosToastError from "../utils/AxiosToastError";
// import toast from "react-hot-toast";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import { Country, State, City } from 'country-state-city';
// import { Autocomplete, TextField, Box } from '@mui/material';

// const AddAddressBox = ({ close, }) => {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates]    = useState([]);
//   const [cities, setCities]    = useState([]);

//   const [country, setCountry] = useState(null);
//   const [state, setState]   = useState(null);
//   const [city, setCity]    = useState(null);

//   const { register, handleSubmit, reset } = useForm();
//   const { fetchAddress } = useGlobalContext();
//   const onSubmit = async (data) => {
//     console.log(data);
//     try {
//       const res = await Axios({
//         ...SummaryApi.createAddress,
//         data: {
//           address_line: data.addressline,
//           city: data.city,
//           state: data.state,
//           country: data.country,
//           pincode: data.pincode,
//           mobile: data.mobile,
//         },
//       });
//       const { data: resData } = res;
//       if (resData.success) {
//         toast.success(resData.message);
//         if (close) {
//           close();
//           reset();
//           fetchAddress();
//         }
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   // 1️⃣ Load countries once
//   useEffect(() => {
//     setCountries(Country.getAllCountries());
//   }, []);

//   // 2️⃣ When country changes, load states
//   useEffect(() => {
//     if (country) {
//       setStates(State.getStatesOfCountry(country.isoCode));
//     } else {
//       setStates([]);
//       setState(null);
//       setCities([]);
//       setCity(null);
//     }
//   }, [country]);

//   // 3️⃣ When state changes, load cities
//   useEffect(() => {
//     if (country && state) {
//       setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
//     } else {
//       setCities([]);
//       setCity(null);
//     }
//   }, [country, state]);

//   // 4️⃣ Propagate up if needed
//   useEffect(() => {
//     onChange?.({ country, state, city });
//   }, [country, state, city, onChange]);

//   const filterStartsWith = (options, { inputValue }) =>
//     options.filter(opt =>
//       opt.name.toLowerCase().startsWith(inputValue.toLowerCase())
//     );
//   return (
//     <section className="bg-black fixed top-0 bottom-0 left-0 right-0 bg-opacity-75 z-50 h-screen overflow-auto">
//       <div className="bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded">
//         <div className="flex justify-between items-center">
//           <h2 className="font-semibold">Add Address</h2>
//           <div onClick={close} className=" cursor-pointer hover:text-red-600">
//             <IoClose size={25} />
//           </div>
//         </div>
//         <form className="mt-4 grid gap-2" onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid gap-1">
//             <label htmlFor="addressline">Address Line :</label>
//             <input
//               type="text"
//               id="addressline"
//               className="border bg-blue-50 p-2 rounded"
//               {...register("addressline", { required: true })}
//             />
//           </div>
//           <div className="grid gap-1">
//             <label htmlFor="city">City :</label>
//             <input
//               type="text"
//               id="city"
//               className="border bg-blue-50 p-2 rounded"
//               {...register("city", { required: true })}
//             />
//           </div>
//           <div className="grid gap-1">
//             <label htmlFor="state">State :</label>
//             <input
//               type="text"
//               id="state"
//               className="border bg-blue-50 p-2 rounded"
//               {...register("state", { required: true })}
//             />
//           </div>
//           <div className="grid gap-1">
//             <label htmlFor="country">Country :</label>
//             <input
//               type="text"
//               id="country"
//               className="border bg-blue-50 p-2 rounded"
//               {...register("country", { required: true })}
//             />
//           </div>
//           <div className="grid gap-1">
//             <label htmlFor="pincode">Pincode :</label>
//             <input
//               type="number"
//               id="pincode"
//               className="border bg-blue-50 p-2 rounded"
//               {...register("pincode", { required: true })}
//             />
//           </div>
//           <div className="grid gap-1">
//             <label htmlFor="mobile">Phone :</label>
//             <input
//               type="tel"
//               id="phone"
//               className="border bg-blue-50 p-2 rounded"
//               {...register("mobile", { required: true })}
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-primary-200 w-full text-white px-4 py-2 rounded-md"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AddAddressBox;

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import { Country, State, City } from "country-state-city";
import { Autocomplete, TextField, Box } from "@mui/material";

const AddAddressBox = ({ close }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const { fetchAddress } = useGlobalContext();

  // Lists for Autocomplete
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Selected values
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");


  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStates([]);
      setSelectedState(null);
      setCities([]);
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCities(
        City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      );
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry]);

  const filterStartsWith = (options, { inputValue }) =>
    options.filter((opt) =>
      opt.name.toLowerCase().startsWith(inputValue.toLowerCase())
    );

  const onSubmit = async (data) => {
    try {
      const res = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city.name,
          state: data.state.name,
          country: data.country.name,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        close?.();
        reset();
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-black fixed inset-0 bg-opacity-75 z-50 h-screen overflow-auto">
      <Box className="bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded">
        <Box className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Add Address</h2>
          <Box onClick={close} className="cursor-pointer hover:text-red-600">
            <IoClose size={25} />
          </Box>
        </Box>

        <form className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Address Line */}
          <Controller
            name="addressline"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address Line"
                variant="outlined"
                error={!!errors.addressline}
                helperText={errors.addressline?.message}
              />
            )}
          />

          {/* Country */}
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Autocomplete
                options={countries}
                value={field.value || null}
                getOptionLabel={(opt) => opt.name}
                filterOptions={filterStartsWith}
                onChange={(_, value) => {
                  field.onChange(value || null);
                  setSelectedCountry(value || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            )}
          />

          {/* State */}
          <Controller
            name="state"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <Autocomplete
                options={states}
                value={field.value || null}
                getOptionLabel={(opt) => opt.name}
                filterOptions={filterStartsWith}
                onChange={(_, value) => {
                  field.onChange(value || null);
                  setSelectedState(value || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
                disabled={!selectedCountry}
              />
            )}
          />

          {/* City */}
          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <Autocomplete
                options={cities}
                value={field.value || null}
                getOptionLabel={(opt) => opt.name}
                filterOptions={filterStartsWith}
                onChange={(_, value) => field.onChange(value || null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
                disabled={!selectedState}
              />
            )}
          />

          {/* Pincode */}
          <Controller
            name="pincode"
            control={control}
            rules={{ required: "Pincode is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Pincode"
                type="number"
                variant="outlined"
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
              />
            )}
          />

          {/* Phone */}
          <Controller
            name="mobile"
            control={control}
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                type="tel"
                variant="outlined"
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary-200 w-full text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </Box>
    </section>
  );
};

export default AddAddressBox;
