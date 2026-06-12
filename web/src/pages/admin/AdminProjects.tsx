import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Modal } from '../../components/Modal';
import { LocationPicker } from '../../components/LocationPicker';
import { propertyService } from '../../services/property.service';
import type { Project } from '../../types';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [newProject, setNewProject] = useState({ 
    name: '', 
    location: '', 
    map_lat: undefined as number | undefined,
    map_lng: undefined as number | undefined,
    description: '', 
    status: 'active', 
    images: '',
    yearDeveloped: '',
    flatConfigs: [{ type: '1bhk', count: 0, price: 0, advance: 0 }],
    numberOfShops: 0,
    shopPrice: 0,
    shopAdvance: 0,
    shopLength: '' as number | '',
    shopWidth: '' as number | ''
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingImages, setEditingImages] = useState<string>('');
  
  const [bulkFlatPrice, setBulkFlatPrice] = useState<number | ''>('');
  const [bulkFlatAdvance, setBulkFlatAdvance] = useState<number | ''>('');
  const [bulkShopPrice, setBulkShopPrice] = useState<number | ''>('');
  const [bulkShopAdvance, setBulkShopAdvance] = useState<number | ''>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploadingImage(true);
    try {
      const uploadPromises = Array.from(e.target.files).map(file => 
        propertyService.uploadImage(file, 'projects')
      );
      
      toast.loading('Uploading images...', { id: 'upload-toast' });
      const urls = await Promise.all(uploadPromises);
      
      if (isEdit) {
        const currentImages = editingImages ? editingImages.split(',').map(u => u.trim()).filter(Boolean) : [];
        setEditingImages([...currentImages, ...urls].join(', '));
      } else {
        const currentImages = newProject.images ? newProject.images.split(',').map(u => u.trim()).filter(Boolean) : [];
        setNewProject({ ...newProject, images: [...currentImages, ...urls].join(', ') });
      }
      
      toast.success('Images uploaded successfully!', { id: 'upload-toast' });
    } catch (error) {
      toast.error('Failed to upload images', { id: 'upload-toast' });
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = (urlToRemove: string, isEdit: boolean) => {
    if (isEdit) {
      const currentImages = editingImages.split(',').map(u => u.trim()).filter(Boolean);
      setEditingImages(currentImages.filter(u => u !== urlToRemove).join(', '));
    } else {
      const currentImages = newProject.images.split(',').map(u => u.trim()).filter(Boolean);
      setNewProject({ ...newProject, images: currentImages.filter(u => u !== urlToRemove).join(', ') });
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.location) {
      toast.error('Name and location are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/admin/projects/create', {
        ...newProject,
        images: newProject.images.split(',').map(url => url.trim()).filter(Boolean)
      });
      toast.success('Project created');
      setShowAddModal(false);
      setNewProject({ 
        name: '', 
        location: '', 
        map_lat: undefined,
        map_lng: undefined,
        description: '', 
        status: 'active', 
        images: '',
        yearDeveloped: '',
        flatConfigs: [{ type: '1bhk', count: 0, price: 0, advance: 0 }],
        numberOfShops: 0,
        shopPrice: 0,
        shopAdvance: 0,
        shopLength: '' as number | '',
        shopWidth: '' as number | ''
      });
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSubmitting(true);
    try {
      await api.put(`/admin/projects/update/${editingProject.id}`, {
        name: editingProject.name,
        location: editingProject.location,
        map_lat: editingProject.map_lat,
        map_lng: editingProject.map_lng,
        description: editingProject.description,
        status: editingProject.status,
        yearDeveloped: editingProject.yearDeveloped,
        images: editingImages.split(',').map(url => url.trim()).filter(Boolean),
        flatPrice: bulkFlatPrice !== '' ? Number(bulkFlatPrice) : undefined,
        flatAdvance: bulkFlatAdvance !== '' ? Number(bulkFlatAdvance) : undefined,
        shopPrice: bulkShopPrice !== '' ? Number(bulkShopPrice) : undefined,
        shopAdvance: bulkShopAdvance !== '' ? Number(bulkShopAdvance) : undefined
      });
      toast.success('Project updated');
      setEditingProject(null);
      setBulkFlatPrice('');
      setBulkFlatAdvance('');
      setBulkShopPrice('');
      setBulkShopAdvance('');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await api.delete(`/admin/projects/delete/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-grey-light">Manage your buildings and projects</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col h-full">
            {project.images && project.images.length > 0 && (
              <div 
                className="h-48 -mt-6 -mx-6 mb-4 rounded-t-xl overflow-hidden cursor-pointer" 
                onClick={() => navigate(`/admin/properties?projectId=${project.id}`)}
              >
                <img 
                  src={project.images[0]} 
                  alt={project.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="flex items-center justify-between mb-4 flex-1">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                onClick={() => navigate(`/admin/properties?projectId=${project.id}`)}
                title="Click to view properties for this project"
              >
                <Building2 className="text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{project.name}</h3>
              </div>
            </div>
            <p className="text-grey-light mb-2">{project.location}</p>
            {project.description && <p className="text-sm text-grey mb-4">{project.description}</p>}
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-grey-dark/40">
              <Button onClick={() => {
                setEditingProject(project);
                setEditingImages(project.images ? (Array.isArray(project.images) ? project.images.join(', ') : project.images) : '');
              }} variant="outline" size="sm" className="flex-1">
                <Edit size={14} className="mr-2" />
                Edit
              </Button>
              <Button onClick={() => handleDelete(project.id)} variant="danger" size="sm" className="flex-1">
                <Trash2 size={14} className="mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input
              type="text"
              className="input-field"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Location Details *</label>
            <input
              type="text"
              className="input-field mb-2"
              placeholder="Address / Location Name"
              value={newProject.location}
              onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              required
            />
            <LocationPicker 
              lat={newProject.map_lat} 
              lng={newProject.map_lng} 
              onChange={(lat, lng, address) => {
                setNewProject(prev => ({
                  ...prev, 
                  map_lat: lat, 
                  map_lng: lng,
                  location: address ? address : prev.location
                }));
              }} 
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Year Developed</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 2023"
              value={newProject.yearDeveloped || ''}
              onChange={(e) => setNewProject({ ...newProject, yearDeveloped: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input-field"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="label flex justify-between">
              <span>Images</span>
              {isUploadingImage && <span className="text-primary text-xs">Uploading...</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="input-field cursor-pointer"
              onChange={(e) => handleImageUpload(e, false)}
              disabled={isUploadingImage}
            />
            {newProject.images && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newProject.images.split(',').map(u => u.trim()).filter(Boolean).map((url, index) => (
                  <div key={index} className="relative w-16 h-16 group">
                    <img src={url} alt="upload" className="w-full h-full object-cover rounded border border-grey-dark" />
                    <button 
                      type="button" 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(url, false)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-grey-dark/40 mt-4">
            <h4 className="text-white font-bold mb-3">Auto-Generate Properties (Optional)</h4>
            
            <div className="mb-6 border border-grey-dark rounded-lg p-4 bg-grey-dark/20">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-white font-bold">Flats</h5>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setNewProject(prev => ({
                      ...prev,
                      flatConfigs: [...prev.flatConfigs, { type: '1bhk', count: 0, price: 0, advance: 0 }]
                    }));
                  }}
                >
                  <Plus size={14} className="mr-1" /> Add Flat Type
                </Button>
              </div>
              
              {newProject.flatConfigs.map((config, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 items-end bg-grey-dark/10 p-3 rounded-lg border border-grey-dark/50">
                  <div className="col-span-2 md:col-span-1">
                    <label className="label text-xs mb-1 block">Type</label>
                    <select
                      className="input-field py-2"
                      value={config.type}
                      onChange={(e) => {
                        const newConfigs = [...newProject.flatConfigs];
                        newConfigs[index].type = e.target.value;
                        setNewProject({ ...newProject, flatConfigs: newConfigs });
                      }}
                    >
                      <option value="1rk">1 RK</option>
                      <option value="1bhk">1 BHK</option>
                      <option value="2bhk">2 BHK</option>
                      <option value="3bhk">3 BHK</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <label className="label text-xs mb-1 block">Count</label>
                    <input
                      type="number"
                      min="0"
                      className="input-field py-2"
                      value={config.count || ''}
                      onChange={(e) => {
                        const newConfigs = [...newProject.flatConfigs];
                        newConfigs[index].count = Number(e.target.value);
                        setNewProject({ ...newProject, flatConfigs: newConfigs });
                      }}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <label className="label text-xs mb-1 block">Rent</label>
                    <input
                      type="number"
                      min="0"
                      className="input-field py-2"
                      value={config.price || ''}
                      onChange={(e) => {
                        const newConfigs = [...newProject.flatConfigs];
                        newConfigs[index].price = Number(e.target.value);
                        setNewProject({ ...newProject, flatConfigs: newConfigs });
                      }}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <label className="label text-xs mb-1 block">Advance</label>
                    <input
                      type="number"
                      min="0"
                      className="input-field py-2"
                      value={config.advance || ''}
                      onChange={(e) => {
                        const newConfigs = [...newProject.flatConfigs];
                        newConfigs[index].advance = Number(e.target.value);
                        setNewProject({ ...newProject, flatConfigs: newConfigs });
                      }}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 flex justify-end h-full items-center">
                    {newProject.flatConfigs.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        className="py-2 px-3"
                        onClick={() => {
                          const newConfigs = newProject.flatConfigs.filter((_, i) => i !== index);
                          setNewProject({ ...newProject, flatConfigs: newConfigs });
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-grey-dark rounded-lg p-4 bg-grey-dark/20">
              <h5 className="text-white font-bold mb-4">Shops</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Number of Shops</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={newProject.numberOfShops || ''}
                    onChange={(e) => setNewProject({ ...newProject, numberOfShops: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Default Dimensions (L × W in ft)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      className="input-field flex-1"
                      placeholder="Length"
                      value={newProject.shopLength || ''}
                      onChange={(e) => setNewProject({ ...newProject, shopLength: e.target.value ? Number(e.target.value) : '' })}
                    />
                    <input
                      type="number"
                      min="0"
                      className="input-field flex-1"
                      placeholder="Width"
                      value={newProject.shopWidth || ''}
                      onChange={(e) => setNewProject({ ...newProject, shopWidth: e.target.value ? Number(e.target.value) : '' })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Default Shop Rent/Price</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={newProject.shopPrice || ''}
                    onChange={(e) => setNewProject({ ...newProject, shopPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Default Shop Advance</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={newProject.shopAdvance || ''}
                    onChange={(e) => setNewProject({ ...newProject, shopAdvance: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create Project</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
        {editingProject && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="label">Project Name *</label>
              <input
                type="text"
                className="input-field"
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Location Details *</label>
              <input
                type="text"
                className="input-field mb-2"
                placeholder="Address / Location Name"
                value={editingProject.location}
                onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                required
              />
              <LocationPicker 
                lat={editingProject.map_lat} 
                lng={editingProject.map_lng} 
                onChange={(lat, lng, address) => {
                  setEditingProject(prev => prev ? {
                    ...prev, 
                    map_lat: lat, 
                    map_lng: lng,
                    location: address ? address : prev.location
                  } : null);
                }} 
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input-field"
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Year Developed</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 2023"
                value={editingProject.yearDeveloped || ''}
                onChange={(e) => setEditingProject({ ...editingProject, yearDeveloped: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input-field"
                value={editingProject.status || 'active'}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="label flex justify-between">
                <span>Images</span>
                {isUploadingImage && <span className="text-primary text-xs">Uploading...</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="input-field cursor-pointer"
                onChange={(e) => handleImageUpload(e, true)}
                disabled={isUploadingImage}
              />
              {editingImages && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingImages.split(',').map(u => u.trim()).filter(Boolean).map((url, index) => (
                    <div key={index} className="relative w-16 h-16 group">
                      <img src={url} alt="upload" className="w-full h-full object-cover rounded border border-grey-dark" />
                      <button 
                        type="button" 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(url, true)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-grey-dark/40 mt-4">
              <h4 className="text-white font-bold mb-3">Bulk Update Rent / Price (Optional)</h4>
              <p className="text-grey-light text-sm mb-3">Leave blank to keep existing prices. Entering a value will update all properties of that type in this project.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Update All Flats Rent</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="New Flat Rent"
                    value={bulkFlatPrice}
                    onChange={(e) => setBulkFlatPrice(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div>
                  <label className="label">Update All Flats Advance</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="New Flat Advance"
                    value={bulkFlatAdvance}
                    onChange={(e) => setBulkFlatAdvance(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div>
                  <label className="label">Update All Shops Rent</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="New Shop Rent"
                    value={bulkShopPrice}
                    onChange={(e) => setBulkShopPrice(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div>
                  <label className="label">Update All Shops Advance</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="New Shop Advance"
                    value={bulkShopAdvance}
                    onChange={(e) => setBulkShopAdvance(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
