"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ApplicantType = "individual" | "joint" | "company";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const steps = [
  { id: 1, label: "Account Type" },
  { id: 2, label: "Applicant Details" },
  { id: 3, label: "Bank & Broker" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Credentials" },
  { id: 6, label: "Declaration" },
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const FILE_KEYS = ["certifiedId", "passportPhoto", "proofOfAddress", "companyDocs"] as const;
type FileKey = (typeof FILE_KEYS)[number];

const FILE_ACCEPTS: Record<FileKey, string> = {
  certifiedId: ".jpg,.jpeg,.png,.pdf",
  passportPhoto: ".jpg,.jpeg,.png",
  proofOfAddress: ".jpg,.jpeg,.png,.pdf",
  companyDocs: ".jpg,.jpeg,.png,.pdf",
};

export default function AccountCreationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [applicantType, setApplicantType] = useState<ApplicantType>("individual");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<FileKey, UploadedFile | null>>({
    certifiedId: null,
    passportPhoto: null,
    proofOfAddress: null,
    companyDocs: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs live at the top level — never remount, always valid
  const certifiedIdRef = useRef<HTMLInputElement>(null);
  const passportPhotoRef = useRef<HTMLInputElement>(null);
  const proofOfAddressRef = useRef<HTMLInputElement>(null);
  const companyDocsRef = useRef<HTMLInputElement>(null);

  const fileRefs: Record<FileKey, React.RefObject<HTMLInputElement | null>> = {
    certifiedId: certifiedIdRef,
    passportPhoto: passportPhotoRef,
    proofOfAddress: proofOfAddressRef,
    companyDocs: companyDocsRef,
  };

  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    idType: "",
    idNumber: "",
    dob: "",
    investorType: "",
    jointFullName: "",
    jointGender: "",
    jointIdType: "",
    jointIdNumber: "",
    jointDob: "",
    jointInvestorType: "",
    companyName: "",
    regNumber: "",
    regDate: "",
    physicalAddress: "",
    postalAddress: "",
    telephone: "",
    cellphone: "",
    fax: "",
    email: "",
    authorisedSignatory1: "",
    authorisedSignatory2: "",
    bankName: "",
    bankBranchCode: "",
    accountNumber: "",
    accountName: "",
    primarySignatureDate: "",
    jointSignatureDate: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const clearError = (field: string) =>
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (applicantType === "individual" || applicantType === "joint") {
        if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!form.gender) newErrors.gender = "Please select a gender";
        if (!form.idType) newErrors.idType = "Please select an ID type";
        if (!form.idNumber.trim()) newErrors.idNumber = "ID number is required";
        if (!form.dob) newErrors.dob = "Date of birth is required";
        if (!form.investorType) newErrors.investorType = "Please select investor type";
      }
      if (applicantType === "joint") {
        if (!form.jointFullName.trim()) newErrors.jointFullName = "Joint applicant full name is required";
        if (!form.jointGender) newErrors.jointGender = "Please select a gender";
        if (!form.jointIdType) newErrors.jointIdType = "Please select an ID type";
        if (!form.jointIdNumber.trim()) newErrors.jointIdNumber = "Joint ID number is required";
        if (!form.jointDob) newErrors.jointDob = "Date of birth is required";
        if (!form.jointInvestorType) newErrors.jointInvestorType = "Please select investor type";
      }
      if (applicantType === "company") {
        if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!form.regNumber.trim()) newErrors.regNumber = "Registration number is required";
        if (!form.regDate) newErrors.regDate = "Date of registration is required";
        if (!form.authorisedSignatory1.trim()) newErrors.authorisedSignatory1 = "At least one signatory is required";
      }
      if (!form.physicalAddress.trim()) newErrors.physicalAddress = "Physical address is required";
      if (!form.telephone.trim()) newErrors.telephone = "Telephone is required";
      if (!form.email.trim()) newErrors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email";
    }

    if (step === 3) {
      if (!form.primarySignatureDate) newErrors.primarySignatureDate = "Please select a date";
      if (applicantType === "joint" && !form.jointSignatureDate) newErrors.jointSignatureDate = "Please select a date";
    }

    if (step === 4) {
      if (!uploadedFiles.certifiedId) newErrors.certifiedId = "Certified copy of ID is required";
      if (!uploadedFiles.passportPhoto) newErrors.passportPhoto = "Passport photo is required";
    }

    if (step === 5) {
      if (!form.username.trim()) newErrors.username = "Username is required";
      else if (form.username.length < 4) newErrors.username = "Username must be at least 4 characters";
      else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) newErrors.username = "Username can only contain letters, numbers, and underscores";
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      else if (!/(?=.*[A-Z])/.test(form.password)) newErrors.password = "Password must contain at least one uppercase letter";
      else if (!/(?=.*[0-9])/.test(form.password)) newErrors.password = "Password must contain at least one number";
      if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStep as Step)) {
      setCurrentStep((prev) => (Math.min(6, prev + 1)) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append("account_type", applicantType);
      formData.append("full_name", form.fullName);
      formData.append("gender", form.gender);
      formData.append("id_type", form.idType);
      formData.append("id_number", form.idNumber);
      formData.append("date_of_birth", form.dob);
      formData.append("investor_type", form.investorType);
      if (applicantType === "joint") {
        formData.append("joint_full_name", form.jointFullName);
        formData.append("joint_gender", form.jointGender);
        formData.append("joint_id_type", form.jointIdType);
        formData.append("joint_id_number", form.jointIdNumber);
        formData.append("joint_date_of_birth", form.jointDob);
        formData.append("joint_investor_type", form.jointInvestorType);
      }
      if (applicantType === "company") {
        formData.append("company_name", form.companyName);
        formData.append("registration_number", form.regNumber);
        formData.append("date_of_registration", form.regDate);
        formData.append("authorised_signatory_1", form.authorisedSignatory1);
        formData.append("authorised_signatory_2", form.authorisedSignatory2);
      }
      formData.append("physical_address", form.physicalAddress);
      formData.append("postal_address", form.postalAddress);
      formData.append("telephone", form.telephone);
      formData.append("cellphone", form.cellphone);
      formData.append("fax", form.fax);
      formData.append("email", form.email);
      formData.append("bank_name", form.bankName);
      formData.append("bank_branch_code", form.bankBranchCode);
      formData.append("account_number", form.accountNumber);
      formData.append("account_name", form.accountName);
      formData.append("primary_signature_date", form.primarySignatureDate);
      if (applicantType === "joint") {
        formData.append("joint_signature_date", form.jointSignatureDate);
      }
      formData.append("username", form.username);
      formData.append("password", form.password);

      // File fields — refs are stable so files are always accessible
      const fileFieldNames: Record<FileKey, string> = {
        certifiedId: "certified_id",
        passportPhoto: "passport_photo",
        proofOfAddress: "proof_of_address",
        companyDocs: "company_docs",
      };
      for (const key of FILE_KEYS) {
        const file = fileRefs[key].current?.files?.[0];
        if (file) formData.append(fileFieldNames[key], file);
      }

      const res = await fetch("https://kwatcha-api.onrender.com/create_account", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || errData?.error || `Server error (${res.status})`);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (key: FileKey, file: File | null) => {
    if (!file) return;
    setUploadedFiles((prev) => ({ ...prev, [key]: { name: file.name, size: file.size, type: file.type } }));
    clearError(key);
  };

  const removeFile = (key: FileKey) => {
    setUploadedFiles((prev) => ({ ...prev, [key]: null }));
    // Reset the actual input so the same file can be re-selected
    const input = fileRefs[key].current;
    if (input) input.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errors[field]}
      </p>
    ) : null;

  const InputField = ({
    label, field, type = "text", placeholder = "", required = false,
  }: { label: string; field: string; type?: string; placeholder?: string; required?: boolean }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={(form as Record<string, string>)[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={`bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${
          errors[field] ? "border-red-500/60 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"
        }`}
      />
      <ErrorMsg field={field} />
    </div>
  );

  const SelectField = ({
    label, field, options, required = false,
  }: { label: string; field: string; options: string[]; required?: boolean }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={(form as Record<string, string>)[field]}
        onChange={(e) => update(field, e.target.value)}
        className={`bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none transition-all appearance-none ${
          errors[field] ? "border-red-500/60 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"
        }`}
      >
        <option value="" className="bg-gray-900">Select...</option>
        {options.map((o) => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
      </select>
      <ErrorMsg field={field} />
    </div>
  );

  const GenderToggle = ({ field, errorField }: { field: string; errorField: string }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
        Gender <span className="text-red-400">*</span>
      </label>
      <div className="flex gap-3">
        {["Male", "Female"].map((g) => (
          <button key={g} type="button" onClick={() => update(field, g)}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              (form as Record<string, string>)[field] === g
                ? "border-blue-500/60 bg-blue-500/15 text-blue-300"
                : errors[errorField]
                ? "border-red-500/40 bg-white/3 text-white/40"
                : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
            }`}>
            {g}
          </button>
        ))}
      </div>
      <ErrorMsg field={errorField} />
    </div>
  );

  // FileUploadCard no longer owns the <input> — it just triggers the top-level ref
  const FileUploadCard = ({
    label, docKey, hint, required = false,
  }: { label: string; docKey: FileKey; hint?: string; required?: boolean }) => {
    const file = uploadedFiles[docKey];
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {file ? (
          <div className="flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-xs font-medium truncate max-w-[160px]">{file.name}</p>
                <p className="text-white/30 text-xs">{formatSize(file.size)}</p>
              </div>
            </div>
            <button type="button" onClick={() => removeFile(docKey)} className="text-white/30 hover:text-red-400 transition-colors ml-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRefs[docKey].current?.click()}
            className={`rounded-lg border-2 border-dashed px-4 py-5 text-center transition-all hover:border-blue-500/40 hover:bg-blue-500/5 ${
              errors[docKey] ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-white/3"
            }`}>
            <svg className={`w-6 h-6 mx-auto mb-2 ${errors[docKey] ? "text-red-400/50" : "text-white/20"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-white/40 text-xs">Tap to upload</p>
            {hint && <p className="text-white/20 text-xs mt-1">{hint}</p>}
          </button>
        )}
        <ErrorMsg field={docKey} />
      </div>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/30" />
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400/80 px-2">{title}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/30" />
    </div>
  );

  const PasswordStrength = ({ password }: { password: string }) => {
    const checks = [
      { label: "8+ characters", pass: password.length >= 8 },
      { label: "Uppercase", pass: /[A-Z]/.test(password) },
      { label: "Number", pass: /[0-9]/.test(password) },
      { label: "Special char", pass: /[^a-zA-Z0-9]/.test(password) },
    ];
    const score = checks.filter((c) => c.pass).length;
    const barColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    const scoreLabels = ["", "Weak", "Fair", "Good", "Strong"];
    const scoreTextColors = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400"];
    if (!password) return null;
    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? barColors[score] : "bg-white/10"}`} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {checks.map((c) => (
              <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-green-400/70" : "text-white/25"}`}>
                {c.pass ? "✓" : "○"} {c.label}
              </span>
            ))}
          </div>
          {score > 0 && <span className={`text-xs font-semibold shrink-0 ml-2 ${scoreTextColors[score]}`}>{scoreLabels[score]}</span>}
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.1) 0%, transparent 60%)" }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 font-playfair">Application Submitted</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-2">Your CSD Securities Account application has been received.</p>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Your trading account username is <span className="text-blue-300 font-semibold">{form.username}</span>. You will be notified via <span className="text-blue-300">{form.email}</span> once your account is approved.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm px-6 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)" }}>

      {/* Hidden file inputs — live at the top level so refs are always stable */}
      {FILE_KEYS.map((key) => (
        <input
          key={key}
          ref={fileRefs[key]}
          type="file"
          accept={FILE_ACCEPTS[key]}
          className="hidden"
          onChange={(e) => handleFileChange(key, e.target.files?.[0] ?? null)}
        />
      ))}

      {/* Header */}
      <div className="border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-white">MSE Trade</a>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secured by Reserve Bank of Malawi
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        {/* Title */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-blue-400/70 uppercase mb-2">CSD Form F1</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight font-playfair">
            Securities Account<br /><span className="text-white/40">Opening Form</span>
          </h1>
          <p className="text-white/40 text-sm mt-3">Central Securities Depository — Reserve Bank of Malawi</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-12 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none min-w-0">
              <button type="button" onClick={() => currentStep > step.id && setCurrentStep(step.id as Step)} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === step.id ? "border-blue-500 bg-blue-500/20 text-blue-300"
                  : currentStep > step.id ? "border-blue-500/50 bg-blue-500/10 text-blue-400/60"
                  : "border-white/10 bg-white/5 text-white/20"
                }`}>
                  {currentStep > step.id ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.id}
                </div>
                <span className={`text-xs hidden md:block whitespace-nowrap ${currentStep === step.id ? "text-blue-300" : "text-white/20"}`}>{step.label}</span>
              </button>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 ${currentStep > step.id ? "bg-blue-500/30" : "bg-white/5"}`} />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 md:p-10 backdrop-blur-sm">

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Account Type</h2>
              <p className="text-white/40 text-sm mb-8">Select the type of account you wish to open.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["individual", "joint", "company"] as ApplicantType[]).map((type) => (
                  <button key={type} type="button" onClick={() => setApplicantType(type)}
                    className={`rounded-xl border p-5 text-left transition-all ${applicantType === type ? "border-blue-500/60 bg-blue-500/10" : "border-white/8 bg-white/3 hover:border-white/20"}`}>
                    <div className={`text-2xl mb-3 ${applicantType === type ? "opacity-100" : "opacity-40"}`}>
                      {type === "individual" ? "👤" : type === "joint" ? "👥" : "🏢"}
                    </div>
                    <div className={`font-semibold text-sm ${applicantType === type ? "text-blue-300" : "text-white/60"}`}>
                      {type === "joint" ? "Joint Applicant" : type === "company" ? "Company / Institution" : "Individual"}
                    </div>
                    <div className="text-xs text-white/30 mt-1">
                      {type === "individual" ? "Personal securities account" : type === "joint" ? "Shared account with co-applicant" : "Corporate or institutional account"}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <p className="text-xs text-amber-300/70 leading-relaxed">
                  <span className="font-bold text-amber-300/90">Required documents: </span>
                  You will need a certified copy of your ID and a passport-size photograph to complete this application.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Applicant Details</h2>
              <p className="text-white/40 text-sm mb-8">All fields marked <span className="text-red-400">*</span> are mandatory.</p>

              {(applicantType === "individual" || applicantType === "joint") && (
                <>
                  <SectionHeader title="Primary Applicant" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><InputField label="Full Name" field="fullName" required placeholder="As it appears on your ID" /></div>
                    <GenderToggle field="gender" errorField="gender" />
                    <SelectField label="Investor Type" field="investorType" options={["Local", "Foreign"]} required />
                    <SelectField label="ID Type" field="idType" options={["National ID", "Passport", "Driver's Licence"]} required />
                    <InputField label="ID Number" field="idNumber" required />
                    <InputField label="Date of Birth" field="dob" type="date" required />
                  </div>
                </>
              )}

              {applicantType === "joint" && (
                <>
                  <SectionHeader title="Joint Applicant" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><InputField label="Full Name" field="jointFullName" required placeholder="Joint applicant's full name" /></div>
                    <GenderToggle field="jointGender" errorField="jointGender" />
                    <SelectField label="Investor Type" field="jointInvestorType" options={["Local", "Foreign"]} required />
                    <SelectField label="ID Type" field="jointIdType" options={["National ID", "Passport", "Driver's Licence"]} required />
                    <InputField label="ID Number" field="jointIdNumber" required />
                    <InputField label="Date of Birth" field="jointDob" type="date" required />
                  </div>
                </>
              )}

              {applicantType === "company" && (
                <>
                  <SectionHeader title="Company / Institution Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><InputField label="Company Name" field="companyName" required placeholder="Registered company name" /></div>
                    <InputField label="Registration Number" field="regNumber" required />
                    <InputField label="Date of Registration" field="regDate" type="date" required />
                  </div>
                  <SectionHeader title="Authorised Signatories" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Signatory 1" field="authorisedSignatory1" placeholder="Full name" required />
                    <InputField label="Signatory 2" field="authorisedSignatory2" placeholder="Full name (optional)" />
                  </div>
                </>
              )}

              <SectionHeader title="Contact Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><InputField label="Physical Address" field="physicalAddress" required placeholder="Street, City" /></div>
                <div className="md:col-span-2"><InputField label="Postal Address" field="postalAddress" placeholder="P.O. Box or street (optional)" /></div>
                <InputField label="Telephone" field="telephone" type="tel" required placeholder="+265 ..." />
                <InputField label="Cellphone" field="cellphone" type="tel" placeholder="+265 ..." />
                <InputField label="Fax" field="fax" type="tel" placeholder="Optional" />
                <div className="md:col-span-2"><InputField label="Email Address" field="email" type="email" required placeholder="you@example.com" /></div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Bank & Broker Details</h2>
              <p className="text-white/40 text-sm mb-8">These details are used for dividend disbursements and broker mandate.</p>

              <SectionHeader title="Stockbrokers Mandate" />
              <div className="rounded-xl border border-white/8 bg-white/3 p-5 text-sm text-white/60 leading-relaxed space-y-3">
                <p>I/We hereby confirm that I/we appoint <span className="text-blue-300 font-semibold">XYZ Capital Pte Ltd</span> to manage my/our CSD Securities Account on our behalf, in accordance with the Terms and Conditions of the Depository in force from time to time.</p>
                <p>I/We understand that <span className="text-blue-300 font-semibold">XYZ Capital Pte Ltd</span> will be responsible for execution of our trade orders at the Malawi Stock Exchange (MSE) and recording them on the CSD System, while RBM or its agents will be responsible for managing both our cash & scrip settlements.</p>
                <p>I/We understand that CSD settlements once confirmed are <span className="text-white/80 font-semibold">irrevocable and irreversible</span> and we indemnify XYZ Capital Pte Ltd against any losses arising as a result of these transactions.</p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Primary Applicant — Date" field="primarySignatureDate" type="date" required />
                {applicantType === "joint" && <InputField label="Joint Applicant — Date" field="jointSignatureDate" type="date" required />}
              </div>
            </div>
          )}

          {/* STEP 4: Documents */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Upload Documents</h2>
              <p className="text-white/40 text-sm mb-8">
                Upload clear, legible copies. Fields marked <span className="text-red-400">*</span> are required to proceed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FileUploadCard label="Certified Copy of ID" docKey="certifiedId" hint="JPG, PNG or PDF • Max 5MB" required />
                <FileUploadCard label="Passport Photo" docKey="passportPhoto" hint="JPG or PNG • Recent photo" required />
                <FileUploadCard label="Proof of Address" docKey="proofOfAddress" hint="Utility bill or bank statement (optional)" />
                {applicantType === "company" && (
                  <div className="md:col-span-2">
                    <FileUploadCard label="Company Registration Documents" docKey="companyDocs" hint="Certificate of incorporation or equivalent" />
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <p className="text-xs text-blue-300/70 leading-relaxed">
                  <span className="font-bold text-blue-300/90">Tip: </span>
                  ID documents must be certified by a Commissioner of Oaths or Justice of the Peace. Ensure all text is clearly legible before uploading.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Credentials */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Create Login Credentials</h2>
              <p className="text-white/40 text-sm mb-8">Set up your username and password to access MSE Trade once your account is approved.</p>

              <SectionHeader title="Account Credentials" />
              <div className="space-y-5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm select-none">@</span>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => update("username", e.target.value)}
                      placeholder="your_username"
                      className={`w-full bg-white/5 border rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.username ? "border-red-500/60 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"}`}
                    />
                  </div>
                  <p className="text-white/25 text-xs mt-0.5">Letters, numbers, and underscores only. Min 4 characters.</p>
                  <ErrorMsg field="username" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Create a strong password"
                      className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.password ? "border-red-500/60 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPassword
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                  <ErrorMsg field="password" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${
                        errors.confirmPassword ? "border-red-500/60 focus:border-red-400"
                        : form.confirmPassword && form.password === form.confirmPassword ? "border-green-500/50"
                        : "border-white/10 focus:border-blue-500/60"
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showConfirmPassword
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <svg className="w-4 h-4 text-green-400 absolute right-9 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <ErrorMsg field="confirmPassword" />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white/3 border border-white/8">
                <p className="text-xs text-white/40 leading-relaxed">
                  <span className="text-white/60 font-semibold">Note: </span>
                  Your login will only be activated after your application is reviewed and approved. A confirmation email will be sent to <span className="text-blue-300">{form.email || "your registered email"}</span>.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Declaration */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Declaration & Submission</h2>
              <p className="text-white/40 text-sm mb-8">Please read and agree to all terms before submitting.</p>

              <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4 text-sm text-white/55 leading-relaxed max-h-72 overflow-y-auto">
                {[
                  "I/We hereby request you to open and maintain a Securities Account in the Central Securities Depository (CSD) in my/our name(s).",
                  "I/We hereby represent and warrant that I/We have good title to such securities that may be held in my/our Securities Account from time to time.",
                  "I/We affirm that the funds to be used for the purchase of Securities through my/our Securities Account will not be funds derived from any money laundering activity or funds generated from terrorist or any other illegal activity.",
                  "I/We hereby confirm that the undersigned Participant has full authority to intermediate and or conduct business on with the Depository on our behalf in keeping with CSD Rules and Procedures that may be in force from time to time.",
                  "I/We agree to be bound by the terms and conditions articulated by the CSD Rules including any procedures and any other instructions.",
                  "I/We undertake to notify the under mentioned Participant of any change of particulars or information provided by me/us in this form.",
                ].map((clause, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-blue-400/60 font-mono text-xs mt-0.5 shrink-0">({String.fromCharCode(105 + i)})</span>
                    <p>{clause}</p>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => setAgreed(!agreed)} className="mt-6 flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${agreed ? "border-blue-500 bg-blue-500" : "border-white/20 bg-white/5"}`}>
                  {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                I/We have read, understood, and agree to all the declarations above.
              </button>
              {!agreed && <p className="text-xs text-white/30 mt-2 ml-8">You must agree before submitting.</p>}

              <div className="mt-6 rounded-xl border border-white/8 bg-white/3 p-5">
                <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">Application Summary</p>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ["Account Type", applicantType === "individual" ? "Individual" : applicantType === "joint" ? "Joint" : "Company/Institution"],
                    ["Name", form.fullName || form.companyName || "—"],
                    ["Email", form.email || "—"],
                    ["ID / Reg No.", form.idNumber || form.regNumber || "—"],
                    ["Bank", form.bankName || "—"],
                    ["Username", form.username || "—"],
                    ["Documents", `${Object.values(uploadedFiles).filter(Boolean).length} uploaded`],
                    ["Broker", "XYZ Capital Pte Ltd"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-white/30 text-xs">{k}</p>
                      <p className="text-white/80 font-medium truncate">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {submitError && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 text-sm font-semibold">Submission failed</p>
              <p className="text-red-400/70 text-xs mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1)) as Step)}
            disabled={currentStep === 1}
            className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-sm px-6 py-2 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            ← Back
          </Button>

          {currentStep < 6 ? (
            <Button type="button" onClick={handleContinue} className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-8 py-2 rounded-lg font-semibold transition-all">
              Continue →
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={!agreed || submitting}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-8 py-2 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : "Submit Application"}
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-white/20 mt-8">CSD Form F1 · Reserve Bank of Malawi · Administered by XYZ Capital Pte Ltd</p>
      </div>
    </div>
  );
}