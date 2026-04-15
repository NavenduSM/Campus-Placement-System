import React from "react";

const Academics = ({ value, onChange, disabled = false }) => {
    const isPursuing = value?.isPursuing || false;
    const scoreType = value?.scoreType || "percentage";

    const handleField = (field, fieldValue) => {
        onChange({ ...value, [field]: fieldValue });
    };

    return (
        <div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10 p-4 md:p-10 mt-2 bg-white shadow-lg rounded-md w-full max-w-4xl justify-center border-2 border-blue-700">
                <div>
                    <p className="mb-1 font-medium">Institution Name</p>
                    <input
                        className="w-full md:w-64 p-2 rounded border border-gray-700 outline-none"
                        type="text"
                        placeholder="Enter institution name"
                        value={value.institutionName}
                        onChange={(e) => handleField("institutionName", e.target.value)}
                        readOnly={disabled}
                    />
                </div>

                <div>
                    <p className="mb-1 font-medium">Degree</p>
                    <select
                        className="w-full md:w-64 p-2 rounded border border-gray-700 outline-none"
                        value={value.degree}
                        onChange={(e) => handleField("degree", e.target.value)}
                        disabled={disabled}
                    >
                        <option value="">Select</option>
                        <option value="secondary">Secondary</option>
                        <option value="high-school">High School</option>
                        <option value="bachelor">Bachelor's</option>
                        <option value="master">Master's</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>

                <div>
                    <p className="mb-1 font-medium">Start Date</p>
                    <input
                        className="w-full md:w-64 p-2 rounded border border-gray-700 outline-none"
                        type="date"
                        value={value.startDate}
                        onChange={(e) => handleField("startDate", e.target.value)}
                        readOnly={disabled}
                    />
                </div>

                <div className="flex flex-col">
                    <p className="mb-1 font-medium">End Date</p>
                    <input
                        className="w-full md:w-64 p-2 rounded border border-gray-700 outline-none"
                        type="date"
                        value={value.endDate}
                        onChange={(e) => handleField("endDate", e.target.value)}
                        disabled={isPursuing}
                        readOnly={disabled}
                    />
                    <div className="flex flex-row gap-2 mt-2">
                        <p className="text-sm">Pursuing</p>
                        <input
                            className="mt-1"
                            type="checkbox"
                            checked={isPursuing}
                            onChange={() => handleField("isPursuing", !isPursuing)}
                            disabled={disabled}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center w-full md:col-span-2">
                    <div>
                        <p className="mb-1 font-medium">Enter {scoreType.toUpperCase()}</p>
                        <input
                            className="w-full md:w-64 p-2 rounded border border-gray-700 outline-none"
                            type="number"
                            placeholder={`Enter ${scoreType}`}
                            value={value.score}
                            onChange={(e) => handleField("score", e.target.value)}
                            readOnly={disabled}
                        />
                    </div>

                    <p className="mt-3 font-medium">Score Type</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name={`scoreType-${value.id}`}
                                value="percentage"
                                checked={scoreType === "percentage"}
                                onChange={(e) => handleField("scoreType", e.target.value)}
                                disabled={disabled}
                            />
                            Percentage
                        </label>

                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name={`scoreType-${value.id}`}
                                value="cgpa"
                                checked={scoreType === "cgpa"}
                                onChange={(e) => handleField("scoreType", e.target.value)}
                                disabled={disabled}
                            />
                            CGPA
                        </label>

                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name={`scoreType-${value.id}`}
                                value="gpa"
                                checked={scoreType === "gpa"}
                                onChange={(e) => handleField("scoreType", e.target.value)}
                                disabled={disabled}
                            />
                            GPA
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Academics;
