import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project }) {
  return (
    <div className="text-center shadow-lg p-10 rounded-xl dark:bg-white">
      <Link href={`/projects/${project.slug}`} className="block">
        <Image src={project.image} width={project.size} height={project.size} className="mx-auto" alt={project.title} />
      </Link>
      <h3 className="text-black text-xl font-medium pt-8 pb-2 font-['0xProtoNerdFont']">{project.title}</h3>
    </div>
  );
}
