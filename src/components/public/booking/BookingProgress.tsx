import { Check } from "lucide-react";

const steps = [
  { num: 1, label: "Service" },
  { num: 2, label: "Time Slot" },
  { num: 3, label: "Medical Form" },
  { num: 4, label: "Confirm" },
];

export default function BookingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full py-6 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">

          {/* Connecting line */}
          <div
            className="absolute left-0 right-0 top-5 h-px"
            style={{ backgroundColor: "rgba(10,31,20,0.1)", zIndex: 0 }}
          />

          {/* Progress line */}
          <div
            className="absolute left-0 top-5 h-px transition-all duration-500"
            style={{
              backgroundColor: "#C9A84C",
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              zIndex: 1,
            }}
          />

          {steps.map((step) => {
            const isDone = step.num < currentStep;
            const isActive = step.num === currentStep;

            return (
              <div
                key={step.num}
                className="flex flex-col items-center gap-2 relative z-10"
              >
                {/* Circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300"
                  style={{
                    backgroundColor: isDone
                      ? "#C9A84C"
                      : isActive
                      ? "#0A1F14"
                      : "white",
                    border: isActive
                      ? "2px solid #0A1F14"
                      : isDone
                      ? "2px solid #C9A84C"
                      : "2px solid rgba(10,31,20,0.15)",
                    color: isDone
                      ? "white"
                      : isActive
                      ? "white"
                      : "rgba(10,31,20,0.3)",
                  }}
                >
                  {isDone ? <Check size={16} /> : step.num}
                </div>

                {/* Label */}
                <p
                  className="text-xs font-medium whitespace-nowrap"
                  style={{
                    color: isActive
                      ? "#0A1F14"
                      : isDone
                      ? "#C9A84C"
                      : "rgba(10,31,20,0.35)",
                  }}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}