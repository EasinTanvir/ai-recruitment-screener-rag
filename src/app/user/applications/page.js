import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

const applications = [
  {
    id: "1",
    role: "AI Talent Acquisition Lead",
    company: "Nexa People",
    status: "Interview scheduled",
    submitted: "Apr 25, 2026",
  },
  {
    id: "2",
    role: "Senior Product Designer",
    company: "Atlas Labs",
    status: "Shortlisted",
    submitted: "Apr 24, 2026",
  },
  {
    id: "3",
    role: "Growth Marketing Manager",
    company: "HumanScale",
    status: "Under review",
    submitted: "Apr 20, 2026",
  },
];

export default function UserApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-4xl bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Recent applications
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">
          Track your progress
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Review the latest status updates for your active applications.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((item) => (
          <Card key={item.id} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  {item.company}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {item.role}
                </h3>
              </div>
              <span className="rounded-3xl bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                {item.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <p>Submitted</p>
              <p>{item.submitted}</p>
            </div>
            <div className="flex gap-3">
              <Button className="w-full">View details</Button>
              <Button variant="secondary" className="w-full">
                Withdraw
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
