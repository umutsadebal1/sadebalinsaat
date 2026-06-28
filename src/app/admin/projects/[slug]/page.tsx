import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { readProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = readProjects().find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-ink">Projeyi Düzenle</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
