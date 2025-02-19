"use client";

import React, { useState } from "react";
import { Upload, Leaf, Loader2, Search, Info } from "lucide-react";

const PlantIdentifier = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
      setResult(null);
    }
  };

  const identifyPlant = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to identify plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-white font-[\'Sniglet\']"
      style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1670693997297-b860307f7bb4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <header className="w-full max-w-5xl flex justify-between items-center py-4">
        <h1 className="text-5xl font-extrabold flex items-center gap-3">
        <Leaf className="w-12 h-12 text-[#1b5e20]" />  
<span className="text-green-900 font-extrabold text-6xl">Botaniq</span>

        </h1>
      </header>

      <div className="bg-[#0d3412]/80 p-12 rounded-3xl shadow-2xl max-w-5xl w-full text-center relative">
        <h2 className="text-6xl font-extrabold text-[#c8e6c9] mb-6">Start Plant Care at Heart</h2>
        <p className="text-2xl text-[#a5d6a7] mb-8">Bringing intelligence to plant care</p>

        {/* Image Upload Section */}
        <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#66bb6a] p-10 rounded-xl bg-[#1b5e20]/80 hover:bg-[#2e7d32] transition">
          <Upload className="w-12 h-12 text-[#66bb6a] mb-3" />
          <span className="text-[#a5d6a7] text-lg font-medium">Upload an image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        {/* Image Preview */}
        {preview && (
          <div className="mt-8 flex justify-center">
            <img src={preview} alt="Plant Preview" className="w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
          </div>
        )}

        {/* Identify Button */}
        <button
          onClick={identifyPlant}
          className="mt-6 bg-gradient-to-r from-[#43a047] to-[#2e7d32] text-white px-8 py-3 rounded-full text-xl font-semibold hover:opacity-90 transition w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Search className="w-6 h-6" />} Identify Plant
        </button>

        {/* Error Message */}
        {error && <p className="text-red-400 mt-4 text-lg font-medium">{error}</p>}

        {/* Display Result */}
        {result && (
          <div className="mt-8 text-left p-8 bg-[#0d3412]/80 rounded-xl shadow-lg border border-[#66bb6a]">
            <h3 className="text-4xl font-bold text-[#66bb6a] flex items-center gap-2"><Info className="w-8 h-8" /> Plant Identified:</h3>
            <p className="text-[#a5d6a7] text-2xl mt-2"><strong>Common Name:</strong> {result.common_name}</p>
            <p className="text-[#a5d6a7] text-2xl"><strong>Scientific Name:</strong> {result.scientific_name}</p>
            <p className="text-[#a5d6a7] text-2xl"><strong>Description:</strong> {result.description}</p>
            <p className="text-[#a5d6a7] text-2xl font-medium mt-4"><strong>Care Tips:</strong></p>
            <ul className="list-disc list-inside text-[#a5d6a7] text-2xl">
              {result.care_tips?.map((tip: string, index: number) => (
                <li key={index} className="mt-1">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantIdentifier;
