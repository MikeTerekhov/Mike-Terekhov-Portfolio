import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <main className="bg-white px-10 md:px-20 lg:px-40 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl py-10 text-center font-['0xProtoNerdFont'] dark:text-white">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => <ProjectCard key={project.slug} project={project} />)}
      </div>
    </main>
  );
}
