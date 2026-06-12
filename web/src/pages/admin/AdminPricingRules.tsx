import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Modal } from '../../components/Modal';
import { propertyService } from '../../services/property.service';
import type { Project, Property } from '../../types';
import { Calculator, ChevronDown, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export const AdminPricingRules: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<'flat' | 'shop' | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUnitType, setSelectedUnitType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic pricing rule state for modal: mapping of number of people -> rent
  const [pricingRule, setPricingRule] = useState<{ [key: string]: number }>({});
  const [newPeopleCount, setNewPeopleCount] = useState<number | ''>('');
  const [newRentAmount, setNewRentAmount] = useState<number | ''>('');

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const [projectsData, propertiesData] = await Promise.all([
        propertyService.getProjects(),
        propertyService.getProperties()
      ]);
      setProjects(projectsData);
      setProperties(propertiesData);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project: Project, unitType: string) => {
    setSelectedProject(project);
    setSelectedUnitType(unitType);
    
    // Parse existing rules
    const rules = project.pricing_rules || {};
    const flatRules = rules.flat || {};
    
    if (unitType === 'shop') {
      setPricingRule(rules.shop || {});
    } else {
      setPricingRule(flatRules[unitType] || {});
    }
    
    setIsModalOpen(true);
  };

  const handleAddRule = () => {
    if (newPeopleCount === '' || newRentAmount === '') return;
    setPricingRule({
      ...pricingRule,
      [newPeopleCount.toString()]: Number(newRentAmount)
    });
    setNewPeopleCount('');
    setNewRentAmount('');
  };

  const handleRemoveRule = (peopleCount: string) => {
    const updated = { ...pricingRule };
    delete updated[peopleCount];
    setPricingRule(updated);
  };

  const handleSaveRules = async () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    
    try {
      const currentRules = selectedProject.pricing_rules || {};
      let updatedRules = { ...currentRules };
      
      if (selectedUnitType === 'shop') {
        updatedRules.shop = pricingRule;
      } else {
        updatedRules.flat = updatedRules.flat || {};
        updatedRules.flat[selectedUnitType] = pricingRule;
      }

      await api.put(`/admin/projects/update/${selectedProject.id}`, {
        pricing_rules: updatedRules
      });
      
      toast.success('Pricing rules updated successfully');
      setIsModalOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update rules');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Calculator className="text-primary" /> Pricing Rules
        </h1>
        <p className="text-grey-light">Define dynamic rent based on occupancy for different unit types.</p>
      </div>

      <div className="space-y-4">
        {projects.map(project => {
          const projectProperties = properties.filter(p => p.projectName === project.name);
          const flatUnits = Array.from(new Set(projectProperties.filter(p => p.type === 'flat' && p.unit_type).map(p => p.unit_type as string)));

          return (
          <Card key={project.id} className="p-0 overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-lighter transition-colors"
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            >
              <h3 className="text-xl font-bold text-white">{project.name}</h3>
              {expandedProject === project.id ? <ChevronDown /> : <ChevronRight />}
            </div>
            
            {expandedProject === project.id && (
              <div className="border-t border-grey-dark/40 p-4 bg-dark-lighter/50 pl-8 space-y-2">
                
                {/* FLAT */}
                {flatUnits.length > 0 && (
                  <div>
                    <div 
                      className="flex items-center gap-2 cursor-pointer text-white font-semibold py-2"
                      onClick={() => setExpandedType(expandedType === 'flat' ? null : 'flat')}
                    >
                      {expandedType === 'flat' ? <ChevronDown size={16} /> : <ChevronRight size={16} />} 
                      Flats
                    </div>
                    {expandedType === 'flat' && (
                      <div className="pl-6 py-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {flatUnits.map(unit => (
                          <Card 
                            key={unit} 
                            className="cursor-pointer hover:border-primary transition-colors text-center p-4 bg-dark"
                            onClick={() => openModal(project, unit)}
                          >
                            <div className="text-lg font-bold text-white uppercase">{unit}</div>
                            <div className="text-sm text-grey mt-1">Configure Rules</div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {flatUnits.length === 0 && (
                  <div className="text-grey-light italic text-sm">No flat properties added to this project yet.</div>
                )}
              </div>
            )}
          </Card>
        )})}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configure Pricing: ${selectedProject?.name} - ${selectedUnitType.toUpperCase()}`}>
        <div className="space-y-6">
          <p className="text-grey-light">Define the rent amount based on the number of people staying.</p>
          
          <div className="space-y-3">
            {Object.keys(pricingRule).sort((a,b) => Number(a) - Number(b)).map(count => (
              <div key={count} className="flex items-center justify-between bg-dark p-3 rounded-lg border border-grey-dark/40">
                <span className="text-white font-bold">{count} {Number(count) === 1 ? 'Member' : 'Members'}</span>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">₹{pricingRule[count]}</span>
                  <button onClick={() => handleRemoveRule(count)} className="text-red-400 text-sm hover:underline">Remove</button>
                </div>
              </div>
            ))}
            
            {Object.keys(pricingRule).length === 0 && (
              <div className="text-center p-4 text-grey border border-dashed border-grey-dark/40 rounded-lg">
                No rules defined yet.
              </div>
            )}
          </div>

          <div className="bg-dark p-4 rounded-lg border border-primary/20 space-y-4">
            <h4 className="text-white font-semibold">Add New Rule</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="label">Number of People</label>
                <input 
                  type="number" 
                  min="1"
                  className="input-field" 
                  placeholder="e.g. 2"
                  value={newPeopleCount}
                  onChange={e => setNewPeopleCount(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              <div className="flex-1">
                <label className="label">Rent Amount</label>
                <input 
                  type="number" 
                  min="0"
                  className="input-field" 
                  placeholder="e.g. 7000"
                  value={newRentAmount}
                  onChange={e => setNewRentAmount(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
            </div>
            <Button onClick={handleAddRule} variant="outline" className="w-full">Add Rule</Button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRules} isLoading={isSubmitting} className="flex items-center gap-2">
              <Save size={16} /> Save Rules
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
