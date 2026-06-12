import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { bookingService } from '../../services/booking.service';
import type { Booking } from '../../types';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bookings</h1>
        <p className="text-grey-light">Manage all property bookings</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const property = typeof booking.property === 'object' ? booking.property : null;
            const user = typeof booking.user === 'object' ? booking.user : null;
            return (
              <Card key={booking.id} className="border-l-4 border-l-primary">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {property?.title || 'Property'}
                      </h3>
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">
                        {property?.type === 'flat' ? '🏠 Flat' : '🏪 Shop'}
                      </span>
                    </div>
                    <p className="text-grey-light text-sm mb-3">
                      {property?.projectName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-grey-light">
                      <p>Customer: <span className="text-white font-medium">{user?.name}</span></p>
                      <p>Phone: <span className="text-white font-medium">{user?.phone}</span></p>
                      <p>Booking: <span className="text-white font-medium">{formatDate(booking.bookingDate)}</span></p>
                      <p>Move-In: <span className="text-white font-medium">{formatDate(booking.moveInDate)}</span></p>
                      {(booking as any).number_of_people && (
                        <p>Occupants: <span className="text-white font-medium">{(booking as any).number_of_people}</span></p>
                      )}
                      {(booking as any).requested_rent && (
                        <p>Computed Rent: <span className="text-green-400 font-bold">₹{(booking as any).requested_rent}</span></p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-grey-light text-xs uppercase font-bold mb-2">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : booking.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} variant="primary" size="sm">
                          Approve
                        </Button>
                        <Button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} variant="danger" size="sm">
                          Reject
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} variant="danger" size="sm">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-grey-light text-lg">No bookings found</p>
        </Card>
      )}
    </div>
  );
};
