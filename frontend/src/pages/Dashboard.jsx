import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDocuments, deleteDocument, getUserData } from "../services/api";
import { loginSuccess } from "../store/authSlice";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isLoggedIn) {
          const userRes = await getUserData();
          dispatch(loginSuccess(userRes.data.userData));
        }
        const res = await getDocuments();
        setDocs(res.data.docs || []);
      } catch (err) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileIcon = (filename) => {
    if (!filename) return "document";
    const ext = filename.split(".").pop().toLowerCase();
    const icons = {
      pdf: "pdf",
      doc: "word",
      docx: "word",
      txt: "text",
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      mp4: "video",
      mp3: "audio",
    };
    return icons[ext] || "document";
  };

  const renderFilePreview = (doc) => {
    const fileType = getFileIcon(doc.title || doc.fileName);

    const previewStyles = {
      pdf: "from-rose-500 to-red-500",
      word: "from-blue-500 to-indigo-500",
      text: "from-slate-500 to-slate-600",
      image: "from-purple-500 to-pink-500",
      video: "from-orange-500 to-yellow-500",
      audio: "from-green-500 to-emerald-500",
      document: "from-teal-500 to-emerald-500",
    };

    const previewIcons = {
      pdf: (
        <svg
          className="w-8 h-8"
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
      ),
      word: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h12"
          />
        </svg>
      ),
      text: (
        <svg
          className="w-8 h-8"
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
      ),
      image: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      video: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      audio: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
      document: (
        <svg
          className="w-8 h-8"
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
      ),
    };

    return (
      <div
        className={`relative w-full h-full bg-gradient-to-br ${previewStyles[fileType]} rounded-t-2xl overflow-hidden`}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* File Content Preview Lines */}
        <div className="absolute inset-0 p-6">
          <div className="flex items-center gap-3 mb-4 opacity-30">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>

          {/* Simulated Content Lines */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="h-2 bg-white/30 rounded-full w-3/4" />
              <div className="h-2 bg-white/20 rounded-full w-1/2" />
            </div>
            <div className="space-y-2 mt-6">
              <div className="h-2 bg-white/20 rounded-full w-full" />
              <div className="h-2 bg-white/20 rounded-full w-5/6" />
              <div className="h-2 bg-white/20 rounded-full w-4/6" />
              <div className="h-2 bg-white/10 rounded-full w-3/4" />
            </div>
            <div className="space-y-2 mt-6">
              <div className="h-2 bg-white/20 rounded-full w-2/3" />
              <div className="h-2 bg-white/10 rounded-full w-5/6" />
              <div className="h-2 bg-white/10 rounded-full w-1/2" />
            </div>
          </div>
        </div>

        {/* File Type Icon Overlay */}
        <div className="absolute bottom-4 right-4 text-white/40">
          {previewIcons[fileType]}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <NavBar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="relative mb-10">
          {/* Background Decoration */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-teal-100/40 to-emerald-100/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 right-0 w-48 h-48 bg-gradient-to-bl from-teal-50/60 to-transparent rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
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
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                      Your Documents
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">
                      Secured and verifiable on the blockchain
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-500" />
                <Link
                  to="/upload"
                  className="relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload Document
                </Link>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium">
                  {docs.length} Document{docs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2 text-slate-500">
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
                <span className="font-medium">Blockchain Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-slideDown">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <svg
                className="w-5 h-5 flex-shrink-0"
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
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-auto text-rose-400 hover:text-rose-600 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-slate-100 rounded-xl w-20" />
                    <div className="h-8 bg-slate-100 rounded-xl w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : docs.length === 0 ? (
          /* Empty State */
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-emerald-50/30 rounded-3xl" />
            <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-16 text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/10">
                <svg
                  className="w-12 h-12 text-teal-600"
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
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">
                No documents yet
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Start securing your documents on the blockchain. Upload your
                first document to get started.
              </p>
              <div className="relative group inline-block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-500" />
                <Link
                  to="/upload"
                  className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload Your First Document
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Document Grid with Previews */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <div
                key={doc._id}
                onMouseEnter={() => setHoveredDoc(doc._id)}
                onMouseLeave={() => setHoveredDoc(null)}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  hoveredDoc === doc._id
                    ? "border-teal-200 shadow-2xl shadow-teal-500/10 translate-y-[-4px]"
                    : "border-slate-200/80 shadow-sm hover:shadow-lg"
                }`}
              >
                {/* Document Preview */}
                <div className="relative h-48 overflow-hidden">
                  {renderFilePreview(doc)}

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredDoc === doc._id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      {doc.ipfsUrl && (
                        <a
                          href={doc.ipfsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 transition-all duration-300"
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
                          Preview
                        </a>
                      )}
                    </div>
                  </div>

                  {/* File Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-white bg-black/20 backdrop-blur-sm border border-white/10">
                      {getFileIcon(doc.title || doc.fileName)}
                    </span>
                  </div>

                  {/* On-Chain Badge */}
                  {doc.txHash && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-emerald-700 bg-emerald-100/90 backdrop-blur-sm border border-emerald-200">
                        <svg
                          className="w-3 h-3"
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
                        On-Chain
                      </span>
                    </div>
                  )}
                </div>

                {/* Document Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-slate-800 mb-1 truncate group-hover:text-teal-700 transition-colors duration-300">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <span className="font-mono truncate">
                        {doc.ipfsCid?.slice(0, 20)}...
                      </span>
                    </div>
                    {doc.createdAt && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{formatDate(doc.createdAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    {doc.ipfsUrl && (
                      <a
                        href={doc.ipfsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-all duration-300"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(doc._id)}
                      disabled={deletingId === doc._id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === doc._id ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 animate-spin"
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
                          Deleting...
                        </>
                      ) : (
                        <>
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hover Gradient Border Bottom */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 ${
                    hoveredDoc === doc._id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
