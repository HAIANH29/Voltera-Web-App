import React, { createContext, useContext, useReducer, useMemo } from "react";

const initialState = {
  step: 1,
  totalSteps: 6,
  data: {
    // Step 1
    title: "",
    brand: undefined,
    model: "",
    year: undefined,
    condition: undefined,
    mileage: undefined,
    description: "",
    // Step 2
    batteryCapacity: undefined,
    batteryHealth: undefined,
    maxChargeSpeed: undefined,
    warrantyRemaining: "",
    batteryReportFile: null,
    // Step 3
    photos: [],
    docVehicleTitle: null,
    docServiceRecords: null,
    docInspection: null,
    docWarranty: null,
    // Step 4
    listingType: "FIXED_PRICE",
    price: undefined,
    acceptOffers: true,
    // Step 5
    location: "",
    deliveryOptions: [], // LOCAL_PICKUP, LOCAL_DELIVERY, REGIONAL_DELIVERY, NATIONWIDE
    features: [],
    additionalFeatures: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, state.totalSteps) };
    case "PREV":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "GOTO":
      return { ...state, step: action.payload };
    case "PATCH":
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
}

const VehiclePostCtx = createContext(null);

export function VehiclePostProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(
    () => ({
      state,
      next: () => dispatch({ type: "NEXT" }),
      prev: () => dispatch({ type: "PREV" }),
      goto: (n) => dispatch({ type: "GOTO", payload: n }),
      patch: (values) => dispatch({ type: "PATCH", payload: values }),
      percent: Math.round(((state.step - 1) / (state.totalSteps - 1)) * 100),
    }),
    [state]
  );

  return <VehiclePostCtx.Provider value={api}>{children}</VehiclePostCtx.Provider>;
}

export function useVehiclePost() {
  const ctx = useContext(VehiclePostCtx);
  if (!ctx) throw new Error("useVehiclePost must be used inside VehiclePostProvider");
  return ctx;
}
