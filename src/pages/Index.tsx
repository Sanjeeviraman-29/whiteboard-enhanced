import { useState } from 'react';
import { ProjectTypeSelector } from '@/components/ProjectTypeSelector';
import { CanvasWorkspace } from '@/components/CanvasWorkspace';

interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
}

const Index = () => {
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);

  const handleProjectTypeSelect = (projectType: ProjectType) => {
    setSelectedProjectType(projectType);
  };

  const handleBackToSelection = () => {
    setSelectedProjectType(null);
  };

  if (selectedProjectType) {
    return (
      <CanvasWorkspace 
        projectType={selectedProjectType}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <ProjectTypeSelector onProjectTypeSelect={handleProjectTypeSelect} />
  );
};

export default Index;
