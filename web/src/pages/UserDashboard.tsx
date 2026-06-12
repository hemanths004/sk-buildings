import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { Modal } from '../components/Modal';
import { bookingService } from '../services/booking.service';
import type { Booking } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Home, Upload, FileText, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<'aadhaar' | 'agreement'>('aadhaar');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const getRentAlert = (booking: Booking) => {
    if (booking.status !== 'confirmed' || !booking.rentDueDate) return null;

    const today = new Date();
    const currentDay = today.getDate();
    const dueDay = booking.rentDueDate;

    let daysRemaining = dueDay - currentDay;
    if (daysRemaining < 0) {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      daysRemaining = daysInMonth - currentDay + dueDay;
    }

    if (daysRemaining <= 5) {
      return {
        daysRemaining,
        message:
          daysRemaining === 0
            ? `Your rent of ${formatCurrency(booking.rentAmount || 0)} for "${
                typeof booking.property === 'object' ? booking.property.title : 'Property'
              }" is due today!`
            : `Your rent of ${formatCurrency(booking.rentAmount || 0)} for "${
                typeof booking.property === 'object' ? booking.property.title : 'Property'
              }" is due in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}!`,
        critical: daysRemaining <= 1,
      };
    }
    return null;
  };

  const activeAlerts = bookings
    .map((b) => getRentAlert(b))
    .filter((alert): alert is NonNullable<typeof alert> => alert !== null);

  const handleUpload = async () => {
    if (!file || !selectedBooking) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);

    try {
      await bookingService.uploadDocument(selectedBooking, formData);
      toast.success('Document uploaded successfully');
      setUploadModal(false);
      setFile(null);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const openUploadModal = (bookingId: string, type: 'aadhaar' | 'agreement') => {
    setSelectedBooking(bookingId);
    setDocumentType(type);
    setUploadModal(true);
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">My Dashboard</h1>
          <Button onClick={() => navigate('/')}>
            <Home size={20} className="mr-2" />
            Browse Properties
          </Button>
        </div>

        {/* Rent Due Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3 mb-8">
            {activeAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border ${
                  alert.critical
                    ? 'bg-red-500/10 border-red-500 text-red-200'
                    : 'bg-yellow-500/10 border-primary text-primary-light'
                }`}
              >
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <Calendar className={alert.critical ? 'text-red-500' : 'text-primary'} size={24} />
                  <div>
                    <p className="font-bold text-white text-base">{alert.message}</p>
                    <p className="text-grey-light text-xs">
                      Please pay on time to avoid interest charges or contact owner.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      toast.success('Payment portal opening...');
                    }}
                    variant={alert.critical ? 'danger' : 'primary'}
                    size="sm"
                  >
                    Pay Rent Now
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success('Owner contact: +91 9110443387');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Contact Owner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-light text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-white">{bookings.length}</p>
              </div>
              <Home size={48} className="text-primary" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-light text-sm mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-500">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </p>
              </div>
              <FileText size={48} className="text-green-500" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-light text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {bookings.filter((b) => b.status === 'pending').length}
                </p>
              </div>
              <Calendar size={48} className="text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Bookings List */}
        <h2 className="text-2xl font-bold text-white mb-6">My Properties</h2>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const property = typeof booking.property === 'object' ? booking.property : null;
              return (
                <Card key={booking.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {property?.title || 'Property'}
                      </h3>
                      {property && (
                        <div className="flex items-center text-grey-light text-sm mb-2">
                          <MapPin size={16} className="mr-1" />
                          <span>{property.location.city}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500 text-white'
                          : booking.status === 'pending'
                          ? 'bg-yellow-500 text-dark'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 bg-dark-lighter p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-grey-light">Booking Date</span>
                      <span className="text-white">{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-grey-light">Move-In Date</span>
                      <span className="text-white">{formatDate(booking.moveInDate)}</span>
                    </div>
                    {booking.rentAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-grey-light">Monthly Rent</span>
                        <span className="text-primary font-bold">
                          {formatCurrency(booking.rentAmount)}
                        </span>
                      </div>
                    )}
                    {booking.rentDueDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-grey-light">Rent Due Day</span>
                        <span className="text-white">{booking.rentDueDate}th of month</span>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div className="border-t border-grey-dark pt-4">
                    <h4 className="text-sm font-bold text-white mb-3">Documents</h4>
                    
                    {/* View Uploaded Files Links */}
                    {booking.documents && booking.documents.length > 0 && (
                      <div className="flex flex-col gap-2 mb-4 bg-dark-lighter p-3 rounded-lg">
                        <p className="text-xs text-grey-light font-semibold mb-1">Uploaded Files:</p>
                        <div className="flex flex-wrap gap-3">
                          {booking.documents.map((doc) => {
                            const absoluteUrl = doc.url.startsWith('http')
                              ? doc.url
                              : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${doc.url}`;
                            return (
                              <a
                                key={doc.id}
                                href={absoluteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-primary hover:underline bg-primary/10 border border-primary/20 px-2 py-1 rounded"
                              >
                                <FileText size={14} className="mr-1" />
                                View {doc.type === 'aadhaar' ? 'Aadhaar' : 'Agreement'}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => openUploadModal(booking.id, 'aadhaar')}
                        variant="outline"
                        size="sm"
                      >
                        <Upload size={16} className="mr-2" />
                        {booking.documents?.some((d) => d.type === 'aadhaar')
                          ? 'Update Aadhaar'
                          : 'Upload Aadhaar'}
                      </Button>
                      <Button
                        onClick={() => openUploadModal(booking.id, 'agreement')}
                        variant="outline"
                        size="sm"
                      >
                        <Upload size={16} className="mr-2" />
                        {booking.documents?.some((d) => d.type === 'agreement')
                          ? 'Update Agreement'
                          : 'Upload Agreement'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <Home size={64} className="text-grey-dark mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-grey mb-2">No Bookings Yet</h3>
              <p className="text-grey-light mb-6">Start by browsing available properties</p>
              <Button onClick={() => navigate('/')}>Browse Properties</Button>
            </div>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModal}
        onClose={() => {
          setUploadModal(false);
          setFile(null);
        }}
        title={`Upload ${documentType === 'aadhaar' ? 'Aadhaar Card' : 'Sales Agreement'}`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Select File (PDF, JPG, PNG)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="input-field"
            />
          </div>
          {file && (
            <div className="bg-dark-lighter p-3 rounded-lg">
              <p className="text-white text-sm">{file.name}</p>
              <p className="text-grey-light text-xs">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
          <Button onClick={handleUpload} isLoading={isUploading} className="w-full">
            Upload Document
          </Button>
        </div>
      </Modal>
    </div>
  );
};
