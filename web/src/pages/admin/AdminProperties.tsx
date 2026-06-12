import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Modal } from '../../components/Modal';
import { propertyService } from '../../services/property.service';
import type { Property, Project, CreatePropertyInput } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Building2, Edit, Trash2, Plus, Search, Filter, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAadhar, setIsUploadingAadhar] = useState(false);
  const [isUploadingAgreement, setIsUploadingAgreement] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [newProperty, setNewProperty] = useState<CreatePropertyInput>({
    title: '',
    type: 'flat',
    unit_type: '1bhk',
    projectId: '',
    price: 0,
    advance: 0,
    floor: undefined,
    sizeSqFt: undefined,
    description: '',
    images: '',
  });

  const [editingImages, setEditingImages] = useState<string>('');

  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || 'all';

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'booked'>('all');
  const [filterProject, setFilterProject] = useState<string>(initialProjectId);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploadingImage(true);
    try {
      const uploadPromises = Array.from(e.target.files).map(file => 
        propertyService.uploadImage(file, 'properties')
      );
      
      toast.loading('Uploading images...', { id: 'upload-toast' });
      const urls = await Promise.all(uploadPromises);
      
      if (isEdit) {
        const currentImages = editingImages ? editingImages.split(',').map(u => u.trim()).filter(Boolean) : [];
        setEditingImages([...currentImages, ...urls].join(', '));
      } else {
        const currentImages = (newProperty as any).images ? (newProperty as any).images.split(',').map((u: string) => u.trim()).filter(Boolean) : [];
        setNewProperty({ ...newProject, images: [...currentImages, ...urls].join(', ') } as any);
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
      const currentImages = (newProperty as any).images.split(',').map((u: string) => u.trim()).filter(Boolean);
      setNewProperty({ ...newProperty, images: currentImages.filter((u: string) => u !== urlToRemove).join(', ') } as any);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propData, projData] = await Promise.all([
        propertyService.getProperties(),
        propertyService.getProjects(),
      ]);
      setProperties(propData);
      setProjects(projData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProperty.title || !newProperty.projectId || newProperty.price <= 0) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    try {
      await propertyService.createProperty({
        ...newProperty,
        unit_type: newProperty.type === 'flat' ? newProperty.unit_type : null,
        images: (newProperty as any).images.split(',').map((url: string) => url.trim()).filter(Boolean)
      });
      toast.success('Property created');
      setShowAddModal(false);
      setNewProperty({
        title: '',
        type: 'flat',
        unit_type: '1bhk',
        projectId: '',
        price: 0,
        advance: 0,
        floor: undefined,
        sizeSqFt: undefined,
        description: '',
        images: '',
      } as any);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setIsSubmitting(true);
    try {
      await propertyService.updateProperty(editingProperty.id, {
        title: editingProperty.title,
        type: editingProperty.type,
        unit_type: editingProperty.type === 'flat' ? editingProperty.unit_type : null,
        price: Number(editingProperty.price),
        advance: Number(editingProperty.advance),
        floor: editingProperty.floor ? Number(editingProperty.floor) : undefined,
        area: editingProperty.area ? Number(editingProperty.area) : undefined,
        description: editingProperty.description || '',
        status: editingProperty.status,
        images: editingImages.split(',').map(url => url.trim()).filter(Boolean),
        tenantName: editingProperty.tenantName,
        tenantPhone: editingProperty.tenantPhone,
        advancePaidDate: editingProperty.advancePaidDate,
        advancePaid: editingProperty.advancePaid ? Number(editingProperty.advancePaid) : undefined,
        rentPaid: editingProperty.rentPaid ? Number(editingProperty.rentPaid) : undefined,
        tenantAadharFile: editingProperty.tenantAadharFile,
        tenantAgreementFile: editingProperty.tenantAgreementFile
      });
      toast.success('Property updated');
      setEditingProperty(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'agreement') => {
    if (!e.target.files || e.target.files.length === 0 || !editingProperty) return;
    
    const file = e.target.files[0];
    const isAadhaar = type === 'aadhaar';
    isAadhaar ? setIsUploadingAadhar(true) : setIsUploadingAgreement(true);
    
    try {
      toast.loading(`Uploading ${type}...`, { id: 'upload-toast' });
      const url = await propertyService.uploadPropertyDocument(file, type, editingProperty.id);
      
      setEditingProperty({
        ...editingProperty,
        [type === 'aadhaar' ? 'tenantAadharFile' : 'tenantAgreementFile']: url
      });
      
      toast.success(`${type} uploaded successfully!`, { id: 'upload-toast' });
    } catch (error) {
      toast.error(`Failed to upload ${type}`, { id: 'upload-toast' });
    } finally {
      isAadhaar ? setIsUploadingAadhar(false) : setIsUploadingAgreement(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await propertyService.updateProperty(id, { status: newStatus as any });
      toast.success('Property status updated');
      setProperties(properties.map(p => p.id === id ? { ...p, status: newStatus as Property['status'] } : p));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertyService.deleteProperty(id);
      toast.success('Property deleted');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(p => 
    (filterStatus === 'all' || p.status === filterStatus) &&
    (filterProject === 'all' || p.projectName === projects.find(proj => proj.id === filterProject)?.name) &&
    (searchKeyword === '' || p.title.toLowerCase().includes(searchKeyword.toLowerCase()))
  ).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Properties</h1>
          <p className="text-grey-light">Manage individual units (flats/shops)</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Add Property
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-3 text-grey-light" />
            <select
              value={filterProject}
              onChange={(e) => {
                setFilterProject(e.target.value);
                if (e.target.value === 'all') {
                  searchParams.delete('projectId');
                } else {
                  searchParams.set('projectId', e.target.value);
                }
                setSearchParams(searchParams);
              }}
              className="input-field pl-10"
            >
              <option value="all">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-grey-light" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input-field"
          >
            <option value="all">All Properties</option>
            <option value="available">Available Only</option>
            <option value="booked">Booked Only</option>
            <option value="rented">Rented Only</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchKeyword('');
              setFilterStatus('all');
            }}
            className="flex items-center justify-center gap-2"
          >
            <Filter size={16} />
            Clear
          </Button>
        </div>
      </Card>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{property.title} {property.type === 'flat' && property.unit_type ? `(${property.unit_type.toUpperCase()})` : ''}</h3>
                  <p className="text-grey text-sm">{property.projectName}</p>
                </div>
                <select
                  value={property.status}
                  onChange={(e) => handleStatusChange(property.id, e.target.value)}
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 cursor-pointer outline-none appearance-none ${
                    property.status === 'available'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : property.status === 'booked'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                  style={{ textAlign: 'center' }}
                >
                  <option value="available" className="bg-dark text-white">AVAILABLE</option>
                  <option value="booked" className="bg-dark text-white">BOOKED</option>
                  <option value="rented" className="bg-dark text-white">RENTED/OCCUPIED</option>
                </select>
              </div>
              <div className="bg-dark-lighter rounded-lg p-4 mb-4 space-y-2 flex-1">
                <div className="flex justify-between items-center border-b border-grey-dark/40 pb-2">
                  <span className="text-grey-light text-sm">Rent/Price:</span>
                  <span className="text-primary font-bold">{formatCurrency(property.price)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-grey-dark/40 pb-2">
                  <span className="text-grey-light text-sm">Advance:</span>
                  <span className="text-white font-semibold">{formatCurrency(property.advance)}</span>
                </div>
                {property.area > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-grey-light text-sm">Area:</span>
                    <span className="text-white font-semibold">{property.area} sq.ft</span>
                  </div>
                )}
                {(property.status === 'rented' || property.status === 'booked') && (
                  <div className="mt-4 pt-4 border-t border-grey-dark/40 space-y-3">
                    <h4 className="text-primary font-bold text-sm mb-2">Tenant Details</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Name:</span>
                      <span className="text-white">{property.tenantName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Phone:</span>
                      {property.tenantPhone ? (
                        <a href={`tel:${property.tenantPhone}`} className="text-primary hover:underline flex items-center gap-1">
                          {property.tenantPhone} <Phone size={12} />
                        </a>
                      ) : (
                        <span className="text-grey">N/A</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Advance Paid Date:</span>
                      <span className="text-white">{property.advancePaidDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Advance Paid:</span>
                      <span className="text-green-400">{formatCurrency(property.advancePaid || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Advance Balance:</span>
                      <span className="text-red-400">{formatCurrency((property.advance || 0) - (property.advancePaid || 0))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Rent Paid:</span>
                      <span className="text-green-400">{formatCurrency(property.rentPaid || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grey-light text-sm">Rent Balance:</span>
                      <span className="text-red-400">{formatCurrency(property.price - (property.rentPaid || 0))}</span>
                    </div>
                    {(property.tenantAadharFile || property.tenantAgreementFile) && (
                      <div className="flex gap-2 pt-2 border-t border-grey-dark/40">
                        {property.tenantAadharFile && (
                          <a href={property.tenantAadharFile} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-1 bg-dark text-xs py-1.5 rounded text-blue-400 hover:text-blue-300">
                            <FileText size={12} /> Aadhar
                          </a>
                        )}
                        {property.tenantAgreementFile && (
                          <a href={property.tenantAgreementFile} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-1 bg-dark text-xs py-1.5 rounded text-purple-400 hover:text-purple-300">
                            <FileText size={12} /> Agreement
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button onClick={() => {
                  setEditingProperty(property);
                  setEditingImages(property.images ? (Array.isArray(property.images) ? property.images.join(', ') : property.images) : '');
                }} variant="outline" size="sm" className="flex-1">
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button onClick={() => handleDelete(property.id)} variant="danger" size="sm" className="flex-1">
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Building2 size={48} className="mx-auto mb-4 text-grey-light" />
          <p className="text-grey-light text-lg">No properties found</p>
        </Card>
      )}

      {/* Modals for Create and Edit (Simplified for brevity, similar to old dashboard) */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Property">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Title / Name *</label>
            <input className="input-field" placeholder="e.g. Flat 101" value={newProperty.title} onChange={e => setNewProperty({...newProperty, title: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Property Type *</label>
              <select 
                className="input-field" 
                value={newProperty.type === 'flat' ? newProperty.unit_type || '1bhk' : newProperty.type} 
                onChange={e => {
                  const val = e.target.value;
                  if (['1rk', '1bhk', '2bhk', '3bhk'].includes(val)) {
                    setNewProperty({...newProperty, type: 'flat', unit_type: val as any});
                  } else {
                    setNewProperty({...newProperty, type: val as any, unit_type: null});
                  }
                }} 
                required
              >
                <option value="1rk">1 RK Flat</option>
                <option value="1bhk">1 BHK Flat</option>
                <option value="2bhk">2 BHK Flat</option>
                <option value="3bhk">3 BHK Flat</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div>
              <label className="label">Project *</label>
              <select className="input-field" value={newProperty.projectId} onChange={e => setNewProperty({...newProperty, projectId: e.target.value})} required>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
                <div>
                  <label className="label">Rent / Price *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Advance Amount</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newProperty.advance}
                    onChange={(e) => setNewProperty({ ...newProperty, advance: Number(e.target.value) })}
                  />
                </div>
                {newProperty.type === 'shop' && (
                  <div>
                    <label className="label">Size in Sq.Ft *</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="e.g. 500"
                      value={newProperty.sizeSqFt || ''}
                      onChange={(e) => setNewProperty({ ...newProperty, sizeSqFt: Number(e.target.value) })}
                      required
                    />
                  </div>
                )}
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
            {(newProperty as any).images && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(newProperty as any).images.split(',').map((u: string) => u.trim()).filter(Boolean).map((url: string, index: number) => (
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
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Add</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!editingProperty} onClose={() => setEditingProperty(null)} title="Edit Property">
        {editingProperty && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="label">Title / Name *</label>
              <input className="input-field" value={editingProperty.title} onChange={e => setEditingProperty({...editingProperty, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Property Type *</label>
                <select 
                  className="input-field" 
                  value={editingProperty.type === 'flat' ? editingProperty.unit_type || '1bhk' : editingProperty.type} 
                  onChange={e => {
                    const val = e.target.value;
                    if (['1rk', '1bhk', '2bhk', '3bhk'].includes(val)) {
                      setEditingProperty({...editingProperty, type: 'flat', unit_type: val as any});
                    } else {
                      setEditingProperty({...editingProperty, type: val as any, unit_type: null});
                    }
                  }} 
                  required
                >
                  <option value="1rk">1 RK Flat</option>
                  <option value="1bhk">1 BHK Flat</option>
                  <option value="2bhk">2 BHK Flat</option>
                  <option value="3bhk">3 BHK Flat</option>
                  <option value="shop">Shop</option>
                  <option value="office">Office</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input-field" value={editingProperty.status} onChange={e => setEditingProperty({...editingProperty, status: e.target.value as any})}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="rented">Rented/Occupied</option>
                </select>
              </div>
            </div>
                <div>
                  <label className="label">Rent / Price *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={editingProperty.price}
                    onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Advance Amount</label>
                  <input
                    type="number"
                    className="input-field"
                    value={editingProperty.advance}
                    onChange={(e) => setEditingProperty({ ...editingProperty, advance: Number(e.target.value) })}
                  />
                </div>
                {editingProperty.type === 'shop' && (
                  <div>
                    <label className="label">Size in Sq.Ft *</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="e.g. 500"
                      value={editingProperty.area || editingProperty.sizeSqFt || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, sizeSqFt: Number(e.target.value), area: Number(e.target.value) })}
                      required
                    />
                  </div>
                )}
            {(editingProperty.status === 'rented' || editingProperty.status === 'booked') && (
              <div className="border border-grey-dark/40 rounded-lg p-4 space-y-4">
                <h4 className="text-primary font-bold">Tenant Tracking Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Tenant Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editingProperty.tenantName || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, tenantName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Tenant Phone</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editingProperty.tenantPhone || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, tenantPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Advance Paid Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={editingProperty.advancePaidDate || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, advancePaidDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Advance Paid Amount</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editingProperty.advancePaid || 0}
                      onChange={(e) => setEditingProperty({ ...editingProperty, advancePaid: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Rent Paid Amount</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editingProperty.rentPaid || 0}
                      onChange={(e) => setEditingProperty({ ...editingProperty, rentPaid: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="label flex justify-between">
                      <span>Aadhar Card (Image/PDF)</span>
                      {isUploadingAadhar && <span className="text-primary text-xs">Uploading...</span>}
                    </label>
                    {editingProperty.tenantAadharFile ? (
                      <div className="flex items-center gap-2 mb-2">
                        <a href={editingProperty.tenantAadharFile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate flex-1">
                          View Uploaded Aadhar
                        </a>
                        <button type="button" onClick={() => setEditingProperty({...editingProperty, tenantAadharFile: ''})} className="text-red-400 text-xs">Remove</button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="input-field cursor-pointer"
                        onChange={(e) => handleFileUpload(e, 'aadhaar')}
                        disabled={isUploadingAadhar}
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="label flex justify-between">
                      <span>Rental Agreement (Image/PDF)</span>
                      {isUploadingAgreement && <span className="text-primary text-xs">Uploading...</span>}
                    </label>
                    {editingProperty.tenantAgreementFile ? (
                      <div className="flex items-center gap-2 mb-2">
                        <a href={editingProperty.tenantAgreementFile} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline text-sm truncate flex-1">
                          View Uploaded Agreement
                        </a>
                        <button type="button" onClick={() => setEditingProperty({...editingProperty, tenantAgreementFile: ''})} className="text-red-400 text-xs">Remove</button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="input-field cursor-pointer"
                        onChange={(e) => handleFileUpload(e, 'agreement')}
                        disabled={isUploadingAgreement}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
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
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingProperty(null)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting || isUploadingAadhar || isUploadingAgreement} disabled={isUploadingAadhar || isUploadingAgreement}>Save</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
