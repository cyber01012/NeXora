import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { AuthFormInput } from "./AuthFormInput";
import { AuthPortalSelect } from "./AuthPortalSelect";
import { AuthSearchableSelect } from "./AuthSearchableSelect";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { authApi } from "../../api/authApi";
import {
  PHONE_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  formatPhoneInput,
  isCompletePhone,
  stripPhoneFormatting,
} from "../../utils/inputFormatters";

export type AdminCategory = "ngo" | "responder" | "help-desk" | "assigning-officer";

const ADMIN_CATEGORY_OPTIONS: { value: AdminCategory; label: string }[] = [
  { value: "ngo", label: "NGO" },
  { value: "responder", label: "Responder" },
  { value: "help-desk", label: "Help Desk" },
  { value: "assigning-officer", label: "Assigning Officer" },
];

export type DynamicUserFormData = {
  username: string;
  name: string;
  contactNumber: string;
  email: string;
  password: string;
  category: AdminCategory | "";
  responderTypeId: string;
};

type DynamicUserFormProps = {
  variant?: "admin" | "default";
  onSubmit?: (data: DynamicUserFormData) => void | Promise<void>;
  submitButtonText?: string;
  loading?: boolean;
};

export function DynamicUserForm({
  variant = "default",
  onSubmit,
  submitButtonText = "Create User",
  loading = false,
}: DynamicUserFormProps) {
  const [responderTypes, setResponderTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [responderTypesLoading, setResponderTypesLoading] = useState(false);
  const [formData, setFormData] = useState<DynamicUserFormData>({
    username: "",
    name: "",
    contactNumber: "",
    email: "",
    password: "",
    category: "",
    responderTypeId: "",
  });

  useEffect(() => {
    if (variant !== "admin") {
      return;
    }

    let cancelled = false;
    setResponderTypesLoading(true);
    authApi
      .getResponderTypes()
      .then((types) => {
        if (!cancelled) {
          setResponderTypes(types);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResponderTypes([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setResponderTypesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [variant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as AdminCategory,
      responderTypeId: value === "responder" ? prev.responderTypeId : "",
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, contactNumber: formatPhoneInput(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contactNumber.trim() && !isCompletePhone(formData.contactNumber)) {
      toast.error(`Enter a valid phone number (e.g. ${PHONE_PLACEHOLDER}).`);
      return;
    }

    if (variant === "admin") {
      if (!formData.category) {
        toast.error("Please select a category.");
        return;
      }
      if (formData.category === "responder" && !formData.responderTypeId) {
        toast.error("Please select a responder type.");
        return;
      }
    }

    await onSubmit?.(formData);
  };

  const responderTypeOptions = responderTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {variant === "admin" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Category</label>
            <AuthPortalSelect
              name="category"
              value={formData.category}
              onValueChange={handleCategoryChange}
              placeholder="Select category"
              required
              options={ADMIN_CATEGORY_OPTIONS}
            />
          </div>

          <AnimatePresence initial={false}>
            {formData.category === "responder" && (
              <motion.div
                key="responder-type"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-1">
                  <label className="block text-sm font-medium text-white/80">Responder Type</label>
                  <AuthSearchableSelect
                    value={formData.responderTypeId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, responderTypeId: value }))
                    }
                    placeholder="Select responder type"
                    searchPlaceholder="Search responder types..."
                    options={responderTypeOptions}
                    loading={responderTypesLoading}
                    emptyMessage="No responder types available."
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AuthFormInput
        name="username"
        placeholder={`Username (e.g. ${USERNAME_PLACEHOLDER})`}
        icon="user"
        variant="portal"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <AuthFormInput
        name="name"
        placeholder="Name"
        icon="user"
        variant="portal"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <AuthFormInput
        name="contactNumber"
        placeholder={`Contact / Phone (e.g. ${PHONE_PLACEHOLDER})`}
        icon="phone"
        variant="portal"
        value={formData.contactNumber}
        onChange={handlePhoneChange}
        required={variant === "admin"}
        maxLength={12}
      />
      <AuthFormInput
        name="email"
        placeholder="Email (e.g. name@example.com)"
        icon="email"
        type="email"
        variant="portal"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <AuthFormInput
        name="password"
        placeholder="Password"
        icon="lock"
        type="password"
        variant="portal"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <AuthSubmitButton variant="portal" disabled={loading}>
        {loading ? "Submitting..." : submitButtonText}
      </AuthSubmitButton>
    </form>
  );
}

export function mapAdminRoleToEndpoint(
  category: AdminCategory
): "ngo" | "help-desk" | "assigning-officer" | "responder" | null {
  switch (category) {
    case "ngo":
      return "ngo";
    case "help-desk":
      return "help-desk";
    case "assigning-officer":
      return "assigning-officer";
    case "responder":
      return "responder";
    default:
      return null;
  }
}

export { stripPhoneFormatting };
