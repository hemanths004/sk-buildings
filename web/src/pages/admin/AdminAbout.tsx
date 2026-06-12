import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Modal } from '../../components/Modal';
import { founderService } from '../../services/founder.service';
import type { Founder, CreateFounderInput } from '../../types';
import { Edit, Trash2, Plus, Users, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAbout: React.FC = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [formData, setFormData] = useState<CreateFounderInput>({
    name: '',
    role: '',
    qualification: '',
    image_url: ''
  });

  const fetchFounders = async () => {
    try {
      const data = await founderService.getFounders();
      setFounders(data);
    } catch (error) {
      toast.error('Failed to load founders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  const handleOpenModal = (founder?: Founder) => {
    if (founder) {
      setEditingFounder(founder);
      setFormData({
        name: founder.name,
        role: founder.role,
        qualification: founder.qualification || '',
        image_url: founder.image_url || ''
      });
    } else {
      setEditingFounder(null);
      setFormData({ name: '', role: '', qualification: '', image_url: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFounder(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const toastId = toast.loading('Uploading image...');
    
    try {
      const url = await founderService.uploadImage(e.target.files[0]);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingFounder) {
        await founderService.updateFounder(editingFounder.id, formData);
        toast.success('Founder updated successfully');
      } else {
        await founderService.createFounder(formData);
        toast.success('Founder added successfully');
      }
      handleCloseModal();
      fetchFounders();
    } catch (error) {
      toast.error('Failed to save founder details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this founder?')) return;
    
    try {
      await founderService.deleteFounder(id);
      toast.success('Founder deleted');
      fetchFounders();
    } catch (error) {
      toast.error('Failed to delete founder');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">About Us</h1>
          <p className="text-grey-light">Manage founders and company details</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          Add Founder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder) => (
          <Card key={founder.id} className="relative group overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => handleOpenModal(founder)}
                className="p-2 bg-dark/80 text-primary hover:bg-primary hover:text-dark rounded-full backdrop-blur-sm transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(founder.id)}
                className="p-2 bg-dark/80 text-red-400 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-sm transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="aspect-square bg-dark-lighter rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-primary/20">
              {founder.image_url ? (
                <img src={founder.image_url} alt={founder.name} className="w-full h-full object-cover" />
              ) : (
                <Users size={48} className="text-grey-light opacity-50" />
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">{founder.name}</h3>
              <p className="text-primary font-medium">{founder.role}</p>
              {founder.qualification && (
                <p className="text-grey-light text-sm mt-2">{founder.qualification}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {founders.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={48} className="text-grey-light mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Founders Added</h3>
          <p className="text-grey-light mb-6">Start building your about page by adding founder profiles.</p>
          <Button onClick={() => handleOpenModal()}>Add First Founder</Button>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingFounder ? 'Edit Founder' : 'Add Founder'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div>
            <label className="label">Role *</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Founder & CEO"
            />
          </div>
          
          <div>
            <label className="label">Qualification / Bio</label>
            <textarea
              className="input-field min-h-[100px]"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. B.Tech in Civil Engineering with 10 years of experience..."
            />
          </div>

          <div>
            <label className="label flex justify-between">
              <span>Profile Image</span>
              {isUploading && <span className="text-primary text-xs">Uploading...</span>}
            </label>
            <div className="flex gap-4 items-center">
              {formData.image_url ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-primary/30">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="absolute inset-0 bg-dark/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-grey-dark flex items-center justify-center bg-dark-lighter">
                  <ImageIcon size={24} className="text-grey-light" />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="input-field cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <p className="text-xs text-grey-light mt-1">Recommended: Square image, max 2MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting || isUploading} disabled={isUploading}>
              {editingFounder ? 'Save Changes' : 'Add Founder'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
