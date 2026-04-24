import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import { getAuthRole, getAuthToken } from "../../utils/auth.js";

const TPO_BASE_URL = import.meta.env.VITE_TPO_BASE_URL || "http://localhost:8083";

const OfferLetter = () => {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [studentPreview, setStudentPreview] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [offerPdf, setOfferPdf] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    const role = getAuthRole();
    if (!token || role !== "tpo") {
      setError("Please sign in with a TPO account to issue offer letters.");
      navigate("/signup", { replace: true });
    }
  }, [navigate]);

  const lookupStudent = async (value = enrollmentNo) => {
    const token = getAuthToken();
    const role = getAuthRole();
    if (!token || role !== "tpo") {
      setError("Please sign in with a TPO account to continue.");
      return;
    }

    const query = value.trim();
    if (!query) {
      setError("Enter the student enrollment number first.");
      return;
    }

    setError("");
    setSuccess("");
    setLoadingStudent(true);
    try {
      const response = await api.get(
        `${TPO_BASE_URL}/api/offers/student-lookup/enrollment/${encodeURIComponent(query)}`
      );
      setStudentPreview(response.data || null);
    } catch (err) {
      setStudentPreview(null);
      const status = err?.response?.status;
      if (status === 403) {
        setError("Access denied. Please sign in again and try the lookup.");
      } else if (status === 404) {
        setError("Student not found. Please check the enrollment number.");
      } else {
        setError("Unable to look up the student right now.");
      }
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getAuthToken();
    const role = getAuthRole();
    if (!token || role !== "tpo") {
      setError("Please sign in with a TPO account to issue offer letters.");
      return;
    }

    if (!enrollmentNo.trim() || !companyName.trim()) {
      setError("Please fill in the enrollment number and company name.");
      return;
    }

    if (!offerPdf) {
      setError("Please upload the offer letter PDF.");
      return;
    }

    setError("");
    setSuccess("");
    setIssuing(true);
    try {
      const formData = new FormData();
      formData.append("enrollmentNo", enrollmentNo.trim());
      formData.append("companyName", companyName.trim());
      formData.append("offerPdf", offerPdf);

      const response = await api.post(`${TPO_BASE_URL}/api/offers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Offer letter generated and issued successfully.");
      setEnrollmentNo("");
      setStudentPreview(null);
      setCompanyName("");
      setOfferPdf(null);
      return response.data;
    } catch (err) {
      const message = err?.response?.data || err?.message || "Failed to issue offer letter.";
      setError(message);
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-2xl border border-blue-100 bg-white shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Issue Offer Letter</h1>
          <p className="text-gray-600 mt-2">
            Upload the final PDF offer letter and issue it to one student.
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2 flex flex-col gap-3">
            <label className="font-semibold text-gray-700">Student Enrollment No</label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value)}
                onBlur={() => lookupStudent()}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. ENR2023001"
              />
            </div>
            <p className="text-sm text-gray-500">
              The student will be looked up automatically when you leave this field.
            </p>
          </div>

          {studentPreview && (
            <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Matched Student</p>
              <div className="mt-2 grid gap-1 text-sm text-gray-700">
                <p><span className="font-semibold">Name:</span> {studentPreview.name || "N/A"}</p>
                <p><span className="font-semibold">Enrollment:</span> {studentPreview.enrollmentNumber || "N/A"}</p>
                <p><span className="font-semibold">Course:</span> {studentPreview.course || "N/A"}</p>
                <p><span className="font-semibold">Email:</span> {studentPreview.email || "N/A"}</p>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="font-semibold text-gray-700">Company Name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="Company name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold text-gray-700">Offer Letter PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setOfferPdf(e.target.files?.[0] || null)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload the final offer letter PDF. This is what the student will download.
            </p>
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          {success && <p className="md:col-span-2 text-sm text-emerald-700">{success}</p>}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={issuing}
              className="rounded-lg bg-blue-700 px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-60"
            >
              {issuing ? "Issuing..." : "Upload & Issue PDF"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferLetter;
