import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Modal } from '../../components/Modal';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { Users, User, Phone, Mail, FileText, Edit, Upload, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminTenants: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [isUpdatingTenant, setIsUpdatingTenant] = useState(false);
  
  const [tenantUploadModal, setTenantUploadModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [tenantDocType, setTenantDocType] = useState<'aadhaar' | 'agreement'>('aadhaar');
  const [tenantFile, setTenantFile] = useState<File | null>(null);
  const [isUploadingTenantDoc, setIsUploadingTenantDoc] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/data/tenants');
      setTenants(response.data?.tenants || []);
    } catch (error) {
      toast.error('Failed to load tenants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    setIsUpdatingTenant(true);
    try {
      await api.put(`/admin/data/tenants/${editingTenant.id}`, {
        name: editingTenant.name,
        phone: editingTenant.phone,
        email: editingTenant.email,
        rentAmount: editingTenant.rentAmount,
        rentDueDay: editingTenant.rentDueDay,
      });

      toast.success('Tenant updated');
      setEditingTenant(null);
      fetchTenants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update tenant');
    } finally {
      setIsUpdatingTenant(false);
    }
  };

  const handleUploadDoc = async () => {
    if (!tenantFile || !selectedTenantId) {
      toast.error('Please select a file');
      return;
    }

    setIsUploadingTenantDoc(true);
    const formData = new FormData();
    formData.append(tenantDocType, tenantFile);

    try {
      const endpoint = tenantDocType === 'aadhaar' 
        ? `/upload/aadhaar/${selectedTenantId}` 
        : `/upload/agreement/${selectedTenantId}`;
        
      await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`${tenantDocType === 'aadhaar' ? 'Aadhaar' : 'Agreement'} uploaded`);
      setTenantUploadModal(false);
      setTenantFile(null);
      fetchTenants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploadingTenantDoc(false);
    }
  };

  const openUpload = (tenantId: string, type: 'aadhaar' | 'agreement') => {
    setSelectedTenantId(tenantId);
    setTenantDocType(type);
    setTenantUploadModal(true);
  };

  const filteredTenants = tenants.filter(t =>
    searchKeyword === '' || 
    t.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    t.phone?.includes(searchKeyword)
  );

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tenants</h1>
        <p className="text-grey-light">Manage tenants, rent tracking, and documents</p>
      </div>

      <div className="relative w-full md:w-1/3 mb-6">
        <Search size={16} className="absolute left-3 top-3 text-grey-light" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="input-field pl-10 w-full"
        />
      </div>

      {filteredTenants.length > 0 ? (
        <div className="space-y-4">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="border-l-4 border-l-green-500">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <User size={18} className="text-green-500" />
                    {tenant.name}
                  </h3>
                  <div className="space-y-1.5 text-sm text-grey-light">
                    <p className="flex items-center gap-2"><Phone size={14} /> {tenant.phone}</p>
                    {tenant.email && <p className="flex items-center gap-2"><Mail size={14} /> {tenant.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-grey-light text-xs uppercase font-bold mb-1">Rent Details</p>
                    <p className="text-sm">Amount: <span className="text-primary font-bold">{tenant.rentAmount ? formatCurrency(tenant.rentAmount) : 'N/A'}</span></p>
                    <p className="text-sm">Due: <span className="text-white">{tenant.rentDueDay ? tenant.rentDueDay + 'th' : 'N/A'}</span></p>
                  </div>
                  <div>
                    <p className="text-grey-light text-xs uppercase font-bold mb-1">Documents</p>
                    <div className="flex flex-col gap-1 text-xs">
                      {tenant.aadhaarUrl ? (
                        <a href={tenant.aadhaarUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                          <FileText size={12} className="mr-1" /> Aadhaar
                        </a>
                      ) : (
                        <span className="text-red-400">Aadhaar: Missing</span>
                      )}
                      {tenant.agreementUrl ? (
                        <a href={tenant.agreementUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                          <FileText size={12} className="mr-1" /> Lease
                        </a>
                      ) : (
                        <span className="text-red-400">Lease: Missing</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <Button onClick={() => setEditingTenant(tenant)} variant="primary" size="sm" className="w-full">
                    <Edit size={14} className="mr-2" /> Edit
                  </Button>
                  <Button onClick={() => openUpload(tenant.id, 'aadhaar')} variant="outline" size="sm" className="w-full">
                    <Upload size={14} className="mr-2" /> Aadhaar
                  </Button>
                  <Button onClick={() => openUpload(tenant.id, 'agreement')} variant="outline" size="sm" className="w-full">
                    <Upload size={14} className="mr-2" /> Agreement
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-grey-light" />
          <p className="text-grey-light text-lg">No tenants found</p>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editingTenant} onClose={() => setEditingTenant(null)} title="Edit Tenant">
        {editingTenant && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input className="input-field" placeholder="Name" value={editingTenant.name || ''} onChange={e => setEditingTenant({...editingTenant, name: e.target.value})} required />
            <input className="input-field" placeholder="Phone" value={editingTenant.phone || ''} onChange={e => setEditingTenant({...editingTenant, phone: e.target.value})} required />
            <input className="input-field" placeholder="Email" value={editingTenant.email || ''} onChange={e => setEditingTenant({...editingTenant, email: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" className="input-field" placeholder="Rent Amount" value={editingTenant.rentAmount || ''} onChange={e => setEditingTenant({...editingTenant, rentAmount: e.target.value})} />
              <input type="number" className="input-field" placeholder="Rent Due Day (1-31)" value={editingTenant.rentDueDay || ''} onChange={e => setEditingTenant({...editingTenant, rentDueDay: e.target.value})} min="1" max="31" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingTenant(null)}>Cancel</Button>
              <Button type="submit" isLoading={isUpdatingTenant}>Save</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={tenantUploadModal} onClose={() => setTenantUploadModal(false)} title={`Upload ${tenantDocType === 'aadhaar' ? 'Aadhaar' : 'Lease Agreement'}`}>
        <div className="space-y-4">
          <input
            type="file"
            onChange={(e) => setTenantFile(e.target.files?.[0] || null)}
            className="w-full text-grey-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary/80"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setTenantUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUploadDoc} isLoading={isUploadingTenantDoc}>Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
