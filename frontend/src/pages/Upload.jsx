import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../services/api";
import NavBar from "../components/NavBar";

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please choose a file to upload");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadDocument(file, title, description);
      if (!res?.data?.success) {
        setError(res?.data?.message || "Upload failed");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50/30 overflow-hidden">
      <NavBar />

      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-lg relative">
          {/* Background Decorations */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-teal-100/40 to-emerald-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-bl from-teal-50/60 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Upload Card */}
          <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-1 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-2xl blur-lg" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-xl font-bold text-slate-800 mb-1">
                Upload Document
              </h1>
              <p className="text-xs text-slate-500">
                Secure your document on IPFS and register on-chain
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200">
                  <svg
                    className="w-4 h-4 text-rose-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs font-medium text-rose-700 flex-1">
                    {error}
                  </p>
                  <button
                    onClick={() => setError("")}
                    className="p-1 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Document File
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 p-6 text-center ${
                    isDragging
                      ? "border-teal-400 bg-teal-50/50"
                      : file
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-slate-300 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                    className="hidden"
                  />

                  {file ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate px-4">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mx-auto">
                        <svg
                          className="w-6 h-6 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">
                        Drop your file here or{" "}
                        <span className="text-teal-600">browse</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Any file type supported
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Document Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                    placeholder="Enter document title"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-50 hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Description
                  <span className="text-slate-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-0 pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief description of your document"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-50 hover:border-slate-300 resize-none"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-teal-50 border border-teal-200">
                <svg
                  className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-teal-700">
                  Your document will be encrypted and stored on IPFS, then
                  registered on the blockchain for immutable proof of ownership.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-all duration-500" />
                <div className="relative w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2.5 px-4 text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Uploading & Registering...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Upload & Register
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
