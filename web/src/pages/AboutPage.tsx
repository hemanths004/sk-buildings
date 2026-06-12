import React, { useState, useEffect } from 'react';
import { founderService } from '../services/founder.service';
import { propertyService } from '../services/property.service';
import type { Founder, Project } from '../types';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { Building2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const AboutPage: React.FC = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foundersData, projectsData] = await Promise.all([
          founderService.getFounders(),
          propertyService.getProjects(),
        ]);
        setFounders(foundersData);
        setProjects(projectsData);
      } catch (error) {
        toast.error('Failed to load About Us information');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#d4af37] font-serif">About Us</h1>
        <p className="text-grey-light max-w-2xl mx-auto">
          Discover our legacy of building dreams, and meet the visionaries behind our most iconic projects.
        </p>
      </div>

      {/* Projects Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#d4af37]/30 pb-4">
          <Building2 className="text-[#d4af37]" size={32} />
          <h2 className="text-3xl font-bold text-white">Our Projects</h2>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="h-full flex flex-col hover:border-[#d4af37]/50 transition-colors">
                {project.images && project.images.length > 0 && (
                  <div className="h-48 -mt-6 -mx-6 mb-6 rounded-t-xl overflow-hidden">
                    <img 
                      src={project.images[0]} 
                      alt={project.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded">
                      {project.status ? project.status.toUpperCase() : 'ACTIVE'}
                    </span>
                    {project.yearDeveloped && (
                      <span className="text-xs font-semibold bg-dark-lighter text-grey-light border border-grey-dark px-2 py-1 rounded">
                        Developed in {project.yearDeveloped}
                      </span>
                    )}
                  </div>
                  <p className="text-grey-light text-sm">{project.location}</p>
                  {project.description && (
                    <p className="text-sm text-gray-300 line-clamp-3 mt-2">{project.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-grey-dark rounded-xl">
            <p className="text-grey-light">No projects information available yet.</p>
          </div>
        )}
      </section>

      {/* Founders Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#d4af37]/30 pb-4">
          <Users className="text-[#d4af37]" size={32} />
          <h2 className="text-3xl font-bold text-white">Meet Our Founders</h2>
        </div>
        
        {founders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {founders.map((founder) => (
              <div key={founder.id} className="group text-center space-y-4">
                <div className="aspect-square w-48 mx-auto rounded-full overflow-hidden border-4 border-dark-lighter group-hover:border-[#d4af37] transition-colors relative">
                  {founder.image_url ? (
                    <img 
                      src={founder.image_url} 
                      alt={founder.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-lighter flex items-center justify-center">
                      <Users size={48} className="text-grey-dark" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{founder.name}</h3>
                  <p className="text-[#d4af37] font-medium text-sm mb-2">{founder.role}</p>
                  {founder.qualification && (
                    <p className="text-grey-light text-sm italic">"{founder.qualification}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-grey-dark rounded-xl">
            <p className="text-grey-light">Founder information is currently being updated.</p>
          </div>
        )}
      </section>

    </div>
  );
};
