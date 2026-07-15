import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";
import Button from "@/components/shared/Button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Workspace preferences
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Company profile
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Manage workspace information and branding.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Company name
              </label>
              <Input value="Nexa People" readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Workspace email
              </label>
              <Input value="recruiter@careersuite.com" readOnly />
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Notification settings
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Update your email and hiring alerts.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notification preferences
              </label>
              <Textarea
                value="Receive weekly summary emails and candidate alerts."
                readOnly
                rows={4}
              />
            </div>
            <Button>Save settings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
