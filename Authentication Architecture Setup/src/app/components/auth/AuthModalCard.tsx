import { ReactNode } from "react";
import { AuthRegistrationCard } from "./AuthRegistrationCard";

type AuthModalCardProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function AuthModalCard({ title, onClose, children }: AuthModalCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px]">
        <AuthRegistrationCard
          variant="modal"
          contentKey={title}
          onClose={onClose}
          showCloseButton
          animateEntry
        >
          <h2 className="mb-6 font-['Inter:Medium',sans-serif] text-[20px] font-medium text-white">
            {title}
          </h2>
          <div className="space-y-5">{children}</div>
        </AuthRegistrationCard>
      </div>
    </div>
  );
}
