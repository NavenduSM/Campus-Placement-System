import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { getEnrollmentNo, getAuthToken } from "../../utils/auth.js";

const STUDENT_BASE_URL = import.meta.env.VITE_STUDENT_BASE_URL || "http://localhost:8081";

const OfferLetters = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOffers = async () => {
    setLoading(true);
    setError("");
    try {
      if (!getAuthToken()) {
        setError("Login required. Please sign in again.");
        return;
      }

      const enrollmentNo = getEnrollmentNo();
      if (!enrollmentNo) {
        setError("Enrollment number not found. Please login again.");
        return;
      }

      const response = await api.get(`${STUDENT_BASE_URL}/api/offers/student/enrollment/${encodeURIComponent(enrollmentNo)}`);
      setOffers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to load offer letters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const fetchOfferBlob = async (offer) => {
    const TPO_BASE_URL = import.meta.env.VITE_TPO_BASE_URL || "http://localhost:8083";
    const offerId = offer.tpoOfferId || offer.id;
    if (!offerId) {
      throw new Error("Offer file is not available yet.");
    }
    const response = await api.get(`${TPO_BASE_URL}/api/offers/${offerId}/download`, {
      responseType: "blob",
    });

    const contentDisposition = response.headers?.["content-disposition"] || "";
    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    const fileName = fileNameMatch?.[1] || `${offer.companyName || "offer"}-letter.pdf`;
    return { blob: response.data, fileName };
  };

  const viewOffer = async (offer) => {
    try {
      const { blob } = await fetchOfferBlob(offer);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError("Failed to open the offer letter.");
    }
  };

  const downloadOffer = async (offer) => {
    try {
      const { blob, fileName } = await fetchOfferBlob(offer);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download the offer letter.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-6 text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Offer Letters</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
          View and download the offer letters issued to your account.
        </p>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4 sm:gap-5">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">Company</p>
                  <h2 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                    {offer.companyName || "Offer Letter"}
                  </h2>
                </div>
                <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <div className="rounded-xl bg-blue-50/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Issued On
                    </p>
                    <p className="mt-1 break-words text-sm text-gray-700">
                      {offer.generatedDate ? new Date(offer.generatedDate).toLocaleString() : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-700">Available to download</p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 shrink-0 sm:flex-row md:w-auto md:flex-col">
                <button
                  type="button"
                  onClick={() => viewOffer(offer)}
                  className="w-full rounded-lg border border-blue-700 px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:w-auto"
                >
                  View PDF
                </button>
                <button
                  type="button"
                  onClick={() => downloadOffer(offer)}
                  className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600 sm:w-auto"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && offers.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600 sm:p-8 sm:text-base">
            No offer letters have been issued yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferLetters;
