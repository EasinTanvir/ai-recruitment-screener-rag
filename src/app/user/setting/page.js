import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

export default function UserSettingPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Profile settings
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            Personal preferences
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Adjust account details and communication preferences for your
            candidate profile.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full name
            </label>
            <Input value="Jamie Morgan" readOnly />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email address
            </label>
            <Input value="jamie.morgan@example.com" readOnly />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Notification preferences
            </label>
            <Input
              value="Email alerts for new roles and application updates"
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button>Save changes</Button>
          <Button variant="secondary">Sign out</Button>
        </div>
      </Card>

      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Candidate support
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Get help with your application status and next steps.
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
          Need assistance? Send a message to the recruitment team or update your
          resume in the candidate portal.
        </div>
      </Card>
    </div>
  );
}
