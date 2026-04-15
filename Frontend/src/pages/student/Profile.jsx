import React, { useEffect, useMemo, useState } from "react";
import api from "../../utils/api.js";
import Academics from "./Academics.jsx";
import { getAuthToken, getEnrollmentNo } from "../../utils/auth.js";

const emptyAcademic = () => ({
    id: Date.now(),
    institutionName: "",
    degree: "",
    startDate: "",
    endDate: "",
    isPursuing: false,
    scoreType: "percentage",
    score: "",
    isLocal: true,
});

const emptyCriteria = {
    hasBacklog: "no",
    gapYear: "no",
    computerScience: "no",
    mathematics: "no",
    stream: "",
};

export const SpecialCriteria = ({ value, onChange, disabled = false }) => {
    const setField = (field, fieldValue) => onChange({ ...value, [field]: fieldValue });

    return (
        <div className="bg-white shadow-lg rounded-md p-8 w-270 justify-center border-2 border-blue-700 mt-8">
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                    <p className="mb-2 font-medium">Any Backlog</p>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="backlog"
                                value="yes"
                                checked={value.hasBacklog === "yes"}
                                onChange={() => setField("hasBacklog", "yes")}
                                disabled={disabled}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="backlog"
                                value="no"
                                checked={value.hasBacklog === "no"}
                                onChange={() => setField("hasBacklog", "no")}
                                disabled={disabled}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <p className="mb-2 font-medium">Gap Year</p>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="gapYear"
                                value="yes"
                                checked={value.gapYear === "yes"}
                                onChange={() => setField("gapYear", "yes")}
                                disabled={disabled}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gapYear"
                                value="no"
                                checked={value.gapYear === "no"}
                                onChange={() => setField("gapYear", "no")}
                                disabled={disabled}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <p className="mb-2 font-medium">Have Computer Science</p>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="computerScience"
                                value="yes"
                                checked={value.computerScience === "yes"}
                                onChange={() => setField("computerScience", "yes")}
                                disabled={disabled}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="computerScience"
                                value="no"
                                checked={value.computerScience === "no"}
                                onChange={() => setField("computerScience", "no")}
                                disabled={disabled}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <p className="mb-2 font-medium">Mathematics</p>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="mathematics"
                                value="yes"
                                checked={value.mathematics === "yes"}
                                onChange={() => setField("mathematics", "yes")}
                                disabled={disabled}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="mathematics"
                                value="no"
                                checked={value.mathematics === "no"}
                                onChange={() => setField("mathematics", "no")}
                                disabled={disabled}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div className="col-span-2">
                    <p className="mb-2 font-medium">12th Stream</p>
                    <div className="flex gap-6">
                        <label>
                            <input
                                type="radio"
                                name="stream"
                                value="commerce"
                                checked={value.stream === "commerce"}
                                onChange={(e) => setField("stream", e.target.value)}
                                disabled={disabled}
                            />{" "}
                            Commerce
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="stream"
                                value="arts"
                                checked={value.stream === "arts"}
                                onChange={(e) => setField("stream", e.target.value)}
                                disabled={disabled}
                            />{" "}
                            Arts
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="stream"
                                value="science"
                                checked={value.stream === "science"}
                                onChange={(e) => setField("stream", e.target.value)}
                                disabled={disabled}
                            />{" "}
                            Science
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const [academics, setAcademics] = useState([emptyAcademic()]);
    const [criteria, setCriteria] = useState(emptyCriteria);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [studentId, setStudentId] = useState(null);
    const [hasCriteria, setHasCriteria] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeName, setResumeName] = useState("");
    const [form, setForm] = useState({
        name: "",
        age: "",
        email: "",
        enrollmentNumber: "",
        course: "",
        courseSpecialisation: "",
        phone: "",
        alternatePhone: "",
        address: "",
    });

    const STUDENT_BASE_URL = import.meta.env.VITE_STUDENT_BASE_URL || "http://localhost:8081";

    useEffect(() => {
        const enrollmentNo = getEnrollmentNo();
        if (enrollmentNo) {
            setForm((prev) => ({
                ...prev,
                enrollmentNumber: prev.enrollmentNumber || enrollmentNo,
            }));
        }
    }, []);

    const addAcademic = () => {
        if (!isEditing) return;
        setAcademics((prev) => [...prev, emptyAcademic()]);
    };
    const removeAcademic = () => {
        if (!isEditing) return;
        if (academics.length === 1) return;
        setAcademics((prev) => prev.slice(0, -1));
    };

    const updateAcademic = (index, next) => {
        setAcademics((prev) => prev.map((a, i) => (i === index ? next : a)));
    };

    const validAcademics = useMemo(() => {
        return academics.filter((a) => a.institutionName || a.degree || a.startDate || a.score);
    }, [academics]);

    const isFormComplete = useMemo(() => {
        return Object.values(form).every((v) => String(v).trim() !== "");
    }, [form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoadData = async () => {
        setError("");
        setSuccess("");
        setIsEditing(true);
        const enrollmentNo = getEnrollmentNo();
        if (!enrollmentNo) {
            setError("Enrollment number not found. Please login again.");
            return;
        }
        try {
            setLoading(true);
            const studentRes = await api.get(`${STUDENT_BASE_URL}/api/students/enrollment/${enrollmentNo}`);
            const s = studentRes.data || {};
            setForm({
                name: s.name || "",
                age: s.age ?? "",
                email: s.email || "",
                enrollmentNumber: s.enrollmentNumber || enrollmentNo,
                course: s.course || "",
                courseSpecialisation: s.courseSpecialisation || "",
                phone: s.phone || "",
                alternatePhone: s.alternatePhone || "",
                address: s.address || "",
            });
            if (s.resumePath) {
                const name = s.resumePath.split(/[\\/]/).pop();
                setResumeName(name || "Resume on file");
            } else {
                setResumeName("");
            }

            const loadedStudentId = s.id;
            if (loadedStudentId) {
                setStudentId(loadedStudentId);
                const [academicsRes, criteriaRes] = await Promise.all([
                    api.get(`${STUDENT_BASE_URL}/api/student-academics/student/${loadedStudentId}`),
                    api.get(`${STUDENT_BASE_URL}/api/student-special-criteria/student/${loadedStudentId}`),
                ]);

                const academicsData = Array.isArray(academicsRes.data) ? academicsRes.data : [];
                if (academicsData.length > 0) {
                    setAcademics(
                        academicsData.map((a) => ({
                            id: a.id ?? Date.now(),
                            institutionName: a.institutionName || "",
                            degree: a.degree || "",
                            startDate: a.startDate || "",
                            endDate: a.endDate || "",
                            isPursuing: a.endDate == null,
                            scoreType: a.scoreType || "percentage",
                            score: a.score ?? "",
                            isLocal: false,
                        }))
                    );
                }

                const c = criteriaRes.data || null;
                if (c) {
                    setHasCriteria(true);
                    let stream = "";
                    if (c.commerce) stream = "commerce";
                    else if (c.arts) stream = "arts";
                    else if (c.science) stream = "science";

                    setCriteria({
                        hasBacklog: c.hasBacklog ? "yes" : "no",
                        gapYear: c.gapYear ? "yes" : "no",
                        computerScience: c.computerScience ? "yes" : "no",
                        mathematics: c.mathematics ? "yes" : "no",
                        stream,
                    });
                } else {
                    setHasCriteria(false);
                }
            }

            setSuccess("Profile data loaded.");
        } catch (err) {
            const message = err?.response?.data || err?.message || "Failed to load data.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAll = async () => {
        setError("");
        setSuccess("");

        if (!getAuthToken()) {
            setError("Login required. Please sign in again.");
            return;
        }

        if (!isFormComplete) {
            setError("Please fill all personal details.");
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value === "" || value === null || value === undefined) {
                    return;
                }
                if (key === "age") {
                    formData.append(key, Number(value));
                } else {
                    formData.append(key, value);
                }
            });
            if (resumeFile) {
                formData.append("resume", resumeFile);
            }

            const token = getAuthToken();
            if (!token) {
                setError("Login required. Please sign in again.");
                return;
            }

            let effectiveStudentId = studentId;
            if (effectiveStudentId) {
                const updatedStudent = await api.put(`${STUDENT_BASE_URL}/api/students/${effectiveStudentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                effectiveStudentId = updatedStudent?.data?.id || effectiveStudentId;
            } else {
                const createdStudent = await api.post(`${STUDENT_BASE_URL}/api/students`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                effectiveStudentId = createdStudent?.data?.id;
                if (!effectiveStudentId) {
                    const enrollmentNo = form.enrollmentNumber || getEnrollmentNo();
                    if (enrollmentNo) {
                        const fetched = await api.get(`${STUDENT_BASE_URL}/api/students/enrollment/${enrollmentNo}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        effectiveStudentId = fetched?.data?.id;
                    }
                }
            }
            if (!effectiveStudentId) {
                setError("Student save failed (no id returned).");
                return;
            }
            setStudentId(effectiveStudentId);

            const academicPayloads = validAcademics.map((a) => ({
                studentId: effectiveStudentId,
                institutionName: a.institutionName,
                degree: a.degree,
                startDate: a.startDate || null,
                endDate: a.isPursuing ? null : (a.endDate || null),
                scoreType: a.scoreType,
                score: a.score === "" ? null : Number(a.score),
                isLocal: Boolean(a.isLocal),
                id: a.id,
            }));

            const academicResults = await Promise.allSettled(
                academicPayloads.map((payload) => {
                    if (payload.isLocal) {
                        const { isLocal, id, ...createPayload } = payload;
                        return api.post(`${STUDENT_BASE_URL}/api/student-academics`, createPayload, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    }
                    const { isLocal, ...updatePayload } = payload;
                    return api.put(`${STUDENT_BASE_URL}/api/student-academics/${payload.id}`, updatePayload, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
            );
            const academicErrors = academicResults.filter((r) => r.status === "rejected");

            const criteriaPayload = {
                hasBacklog: criteria.hasBacklog === "yes",
                gapYear: criteria.gapYear === "yes",
                computerScience: criteria.computerScience === "yes",
                mathematics: criteria.mathematics === "yes",
                commerce: criteria.stream === "commerce",
                arts: criteria.stream === "arts",
                science: criteria.stream === "science",
            };

            if (hasCriteria) {
                await api.put(`${STUDENT_BASE_URL}/api/student-special-criteria/student/${effectiveStudentId}`, criteriaPayload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await api.post(`${STUDENT_BASE_URL}/api/student-special-criteria`, criteriaPayload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHasCriteria(true);
            }

            if (academicErrors.length > 0) {
                setSuccess(`Profile saved, but ${academicErrors.length} academic record(s) failed.`);
            } else {
                setSuccess("Profile data saved.");
            }
            setResumeFile(null);
            setIsEditing(false);
        } catch (err) {
            const message = err?.response?.data || err?.message || "Failed to save data.";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="w-full justify-center items-center flex flex-col  pt-10 pb-10">
                <h1 className="text-2xl font-semibold ">Student Personal Information</h1>
                {error && <p className="text-red-600 mt-3">{error}</p>}
                {success && <p className="text-green-600 mt-3">{success}</p>}

                <form className="grid grid-cols-2 gap-x-40 gap-y-10 p-10 mt-5 bg-white shadow-lg rounded-md w-3/4 justify-center border-2 border-blue-700">
                    <div>
                        <p className="mb-1 font-medium">Name: </p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <p className="mb-1 font-medium">Age</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your age"
                        />
                    </div>
                    <div>
                        <p className="mb-1 font-medium">Email</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <p className="mb-1 font-medium">Enrollment Number</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="text"
                            name="enrollmentNumber"
                            value={form.enrollmentNumber}
                            onChange={handleChange}
                            readOnly={!isEditing || Boolean(getEnrollmentNo())}
                            title={getEnrollmentNo() ? "Enrollment number is taken from your login and cannot be changed." : ""}
                            placeholder="Enter your enrollment number"
                        />
                    </div>
                    <div>
                        <p className="mb-1 font-medium">Course</p>
                        <select
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            name="course"
                            id="course"
                            value={form.course}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select</option>
                            <option value="pgdm">PGDM</option>
                            <option value="ba eco">BA ECO</option>
                            <option value="bba">BBA</option>
                            <option value="bca">BCA</option>
                            <option value="mca">MCA</option>
                        </select>
                    </div>
                    <div>
                        <p className="mb-1 font-medium">Course Specialisation</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="text"
                            name="courseSpecialisation"
                            value={form.courseSpecialisation}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your course specialisation"
                        />
                    </div>
                    <div>
                        <p className="mb-1 font-medium">Phone Number</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <div>
                        <p className="mb-1 ">Alternate Phone Number</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="tel"
                            name="alternatePhone"
                            value={form.alternatePhone}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your alternate phone number"
                        />
                    </div>
                    <div className="col-span-2">
                        <p className="mb-1">Address</p>
                        <input
                            className="w-64 p-2 rounded border border-gray-700 outline-none"
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Enter your address"
                        />
                    </div>
                    <div className="col-span-2">
                        <p className="mb-1 font-medium">Resume</p>
                        {resumeName && (
                            <p className="text-sm text-gray-600 mb-2">Current: {resumeName}</p>
                        )}
                        <input
                            className="w-80 p-2 rounded border border-gray-700 outline-none"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <button
                            type="button"
                            onClick={handleLoadData}
                            disabled={loading}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mt-2"
                        >
                            {loading ? "Loading..." : "Update Profile"}
                        </button>
                    </div>
                </form>

                <h1 className="text-2xl font-semibold  pt-10 ">Acadmics Information</h1>

                {academics.map((a, index) => (
                    <div className="mt-5" key={a.id}>
                        <Academics value={a} onChange={(next) => updateAcademic(index, next)} disabled={!isEditing} />
                    </div>
                ))}

                <div className="ml-220" >
                    <button onClick={addAcademic} disabled={!isEditing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-60">Add</button>
                    {academics.length > 1 && (
                        <button onClick={removeAcademic} disabled={!isEditing} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4 disabled:opacity-60">Remove</button>
                    )}
                </div>

                <h2 className="text-2xl font-semibold  pt-10">Additinal Information</h2>
                <SpecialCriteria value={criteria} onChange={setCriteria} disabled={!isEditing} />

                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-60"
                    onClick={handleSubmitAll}
                    disabled={saving || !isEditing}
                >
                    {saving ? "Saving..." : "Submit"}
                </button>
            </div>
        </>
    );
};

export default Profile;
