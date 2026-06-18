import React from 'react';
import { DetailList, ProfileCard, SectionHeader } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const Projects = ({ projects }) => {
  const { content } = useLanguage();
  const { projects: projectsContent } = content;

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="projects">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker={projectsContent.subtitle}
          title={projectsContent.title}
          summary={projectsContent.summary}
        />

        <div className="grid gap-4">
          {projects.map((project, i) => (
            <ProfileCard
              key={i}
              kicker="Open Source / Case Study"
              title={project.title}
              tags={project.tags}
              cta={project.url ? { href: project.url, label: 'View source' } : null}
            >
              <DetailList items={project.highlights} />
            </ProfileCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
