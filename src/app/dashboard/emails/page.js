import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { emailTemplates } from "@/data/dummyData";

export default function EmailsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Emails
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Candidate communications
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {emailTemplates.map((template) => (
          <Card key={template.id} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {template.title}
              </p>
              <h2 className="text-xl font-semibold text-slate-950">
                {template.subject}
              </h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {template.preview}
            </p>
            <Button variant="secondary" className="w-full">
              Preview
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
