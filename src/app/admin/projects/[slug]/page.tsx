import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { readProjects } from "@/lib/data";
import { readUnitStatuses } from "@/lib/unit-status-store";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = readProjects().find((p) => p.slug === slug);
  if (!base) notFound();

  // Show the persisted (live) unit statuses in the form.
  const overrides = await readUnitStatuses(slug);
  const project =
    overrides && base.tour3D
      ? {
          ...base,
          tour3D: {
            ...base.tour3D,
            unitStatuses: { ...(base.tour3D.unitStatuses ?? {}), ...overrides },
          },
        }
      : base;

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-ink">Projeyi Düzenle</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
