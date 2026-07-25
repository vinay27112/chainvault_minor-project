import React, { useState } from "react";
import { verifyDocument } from "../services/api";
import NavBar from "../components/NavBar";

const Verify = () => {
  const [cid, setCid] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await verifyDocument(cid.trim());
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify this document");
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address, length = 10) => {
    if (!address) return "";
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50/30 overflow-hidden">
      <NavBar />

      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-lg relative">
          {/* Background Decorations */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-teal-100/40 to-emerald-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-bl from-teal-50/60 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Verify Card */}
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-xl font-bold text-slate-800 mb-1">
                Verify Document
              </h1>
              <p className="text-xs text-slate-500">
                Check document authenticity by IPFS CID
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

            {/* Verify Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CID Input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  IPFS Content Identifier (CID)
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
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={cid}
                    onChange={(e) => setCid(e.target.value)}
                    required
                    autoFocus
                    placeholder="bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-50 hover:border-slate-300"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Enter the IPFS CID to verify document authenticity on-chain
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
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Verify Document
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </button>
            </form>

            {/* Verification Result */}
            {result && (
              <div className="mt-5">
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
                  {/* Success Header */}
                  <div className="px-4 py-3 border-b border-emerald-200 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          {result.message || "Document Verified Successfully"}
                        </p>
                        <p className="text-[11px] text-emerald-600">
                          This document is authentic and registered on-chain
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="p-4 space-y-2.5">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-slate-500"
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
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-slate-400 font-medium">
                          Title
                        </p>
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {result.title || "Untitled"}
                        </p>
                      </div>
                    </div>

                    {/* File Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-slate-400 font-medium">
                          File
                        </p>
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {result.fileName || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-slate-400 font-medium">
                          Owner
                        </p>
                        <p className="text-sm font-mono font-medium text-slate-700 truncate">
                          {truncateAddress(result.owner, 8)}
                        </p>
                      </div>
                    </div>

                    {/* Registered Date */}
                    {result.registeredAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-slate-400 font-medium">
                            Registered
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(result.registeredAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View File Button */}
                  {result.ipfsUrl && (
                    <div className="px-4 pb-4">
                      <a
                        href={result.ipfsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 shadow-sm"
                      >
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View File on IPFS
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
