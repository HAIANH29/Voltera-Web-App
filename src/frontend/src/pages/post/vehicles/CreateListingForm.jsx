import React, { useState } from "react";
import { Upload, X, Plus, Car, Battery, Camera, FileText, MapPin, DollarSign, Gauge } from "lucide-react";
import toast from "react-hot-toast";
import "./createListingForm.css";

// props gợi ý (nếu cần dùng lại cho "battery")
export default function CreateListingForm({ listingType = "vehicle", currentUser = null, onSubmit = () => {} }) {
  const [step, setStep] = useState(1);
  const totalSteps = listingType === "vehicle" ? 6 : 5;

  const [formData, setFormData] = useState({
    // Basic
    title: "",
    brand: "",
    model: "",
    year: "",
    condition: "",
    description: "",

    // Vehicle specific
    mileage: "",
    bodyType: "",
    color: "",
    fuelType: "electric",
    transmission: "automatic",
    drivetrain: "",

    // Battery
    batteryCapacity: "",
    batteryHealth: "",
    batteryBrand: "",
    batteryModel: "",
    chargingSpeed: "",
    warrantyRemaining: "",

    // Pricing & Listing
    listingType: "sale",
    price: "",
    reservePrice: "",
    auctionDuration: "7",
    acceptOffers: true,

    // Location & Contact
    location: "",
    deliveryOptions: [],

    // Features
    features: [],
    customFeatures: "",

    // Media
    images: [],
    documents: [],

    // Verification
    agreeTerms: false,
    confirmOwnership: false,
  });