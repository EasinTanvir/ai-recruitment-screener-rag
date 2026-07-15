import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";

export default function CreateJobPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Create job
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Post a new role
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use this form to design a clean job listing interface. All fields are
          mock-only and do not submit.
        </p>
      </div>

      <Card className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Job title
            </label>
            <Input placeholder="Senior Product Designer" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Company
            </label>
            <Input placeholder="Atlas Labs" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Location
            </label>
            <Input placeholder="Remote" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employment type
            </label>
            <Input placeholder="Full-time" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Short description
          </label>
          <Textarea
            placeholder="Lead product initiatives across mobile and web teams."
            rows={4}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Role responsibilities
          </label>
          <Textarea
            placeholder="Design multi-platform experiences, collaborate with product and engineering teams."
            rows={4}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Requirements
          </label>
          <Textarea
            placeholder="5+ years of experience, strong portfolio, collaboration skills."
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button>Save job draft</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>
    </div>
  );
}
