import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { propertyService } from '../services/property.service';
import { bookingService } from '../services/booking.service';
import type { Property } from '../types';
import { formatCurrency } from '../utils/helpers';
import { Calendar, IndianRupee, CreditCard, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [paymentType, setPaymentType] = useState<'online' | 'offline'>('online');
  const [rentDueDate, setRentDueDate] = useState('5');
  const [numberOfPeople, setNumberOfPeople] = useState<number | ''>('');
  const [tenantType, setTenantType] = useState<'family' | 'bachelors' | ''>('');
  const [dynamicRent, setDynamicRent] = useState<number | null>(null);

  useEffect(() => {
    if (property && numberOfPeople !== '' && (tenantType === 'bachelors' || property.type === 'shop')) {
      const rules = (property as any).project?.pricing_rules;
      if (rules) {
        if (property.type === 'shop' && rules.shop) {
          const shopRent = rules.shop[numberOfPeople.toString()];
          if (shopRent) setDynamicRent(shopRent);
          else setDynamicRent(null);
        } else if (property.type === 'flat' && property.unit_type && rules.flat) {
          const flatRent = rules.flat[property.unit_type]?.[numberOfPeople.toString()];
          if (flatRent) setDynamicRent(flatRent);
          else setDynamicRent(null);
        } else {
          setDynamicRent(null);
        }
      }
    } else {
      setDynamicRent(null);
    }
  }, [numberOfPeople, property, tenantType]);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getProperty(id!);
      setProperty(data);
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast('Please login to complete your booking', { icon: '🔒' });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!moveInDate) {
      toast.error('Please select move-in date');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingService.createBooking({
        property: id!,
        moveInDate,
        paymentType,
        numberOfPeople: numberOfPeople ? Number(numberOfPeople) : undefined,
        rentAmount: dynamicRent || property?.price,
        rentDueDate: Number(rentDueDate),
      });

      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="text-grey-light hover:text-white mb-6"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-primary mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Move-In Date *</label>
                  <Input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setMoveInDate(newDate);
                      if (newDate) {
                        const day = new Date(newDate).getDate();
                        setRentDueDate(day.toString());
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    icon={<Calendar size={20} />}
                    required
                  />
                </div>

                <div>
                  <label className="label">Payment Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType('online')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentType === 'online'
                          ? 'border-primary bg-primary/10'
                          : 'border-grey-dark hover:border-grey'
                      }`}
                    >
                      <CreditCard size={24} className={paymentType === 'online' ? 'text-primary' : 'text-grey'} />
                      <p className={`mt-2 font-semibold ${paymentType === 'online' ? 'text-primary' : 'text-white'}`}>
                        Pay Online
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('offline')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentType === 'offline'
                          ? 'border-primary bg-primary/10'
                          : 'border-grey-dark hover:border-grey'
                      }`}
                    >
                      <Phone size={24} className={paymentType === 'offline' ? 'text-primary' : 'text-grey'} />
                      <p className={`mt-2 font-semibold ${paymentType === 'offline' ? 'text-primary' : 'text-white'}`}>
                        Contact Owner
                      </p>
                    </button>
                  </div>
                </div>

                {property.type === 'flat' && (
                  <div>
                    <label className="label">Who will be staying?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => { setTenantType('family'); setNumberOfPeople(''); }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          tenantType === 'family'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-grey-dark hover:border-grey text-white'
                        }`}
                      >
                        Family
                      </button>
                      <button
                        type="button"
                        onClick={() => setTenantType('bachelors')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          tenantType === 'bachelors'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-grey-dark hover:border-grey text-white'
                        }`}
                      >
                        Bachelors
                      </button>
                    </div>
                  </div>
                )}

                {(property.type !== 'flat' || tenantType === 'bachelors') && (
                  <div>
                    <label className="label">Number of People</label>
                    <Input
                      type="number"
                      min="1"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Enter number of people staying"
                      required
                    />
                    {dynamicRent !== null && (
                      <p className="text-green-400 text-sm mt-1 font-semibold">
                        Dynamic rent applied based on occupancy: {formatCurrency(dynamicRent)}
                      </p>
                    )}
                  </div>
                )}

                {property.type === 'flat' && (
                  <>
                    <div>
                      <label className="label">Rent Due Date (Day of Month)</label>
                      <Input
                        type="number"
                        value={rentDueDate}
                        onChange={(e) => setRentDueDate(e.target.value)}
                        min="1"
                        max="31"
                        placeholder="Day of month (1-31)"
                      />
                      <p className="text-grey-light text-sm mt-1">
                        You'll receive reminders 5 days before this date
                      </p>
                    </div>
                  </>
                )}

                <div className="bg-dark-lighter p-4 rounded-lg">
                  <h3 className="font-bold text-white mb-2">Important Note</h3>
                  <ul className="text-grey-light text-sm space-y-1 list-disc list-inside">
                    <li>After booking, you'll need to upload your Aadhaar card</li>
                    <li>Sales agreement document will be required</li>
                    <li>Admin will verify your documents before confirmation</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {paymentType === 'online' ? 'Proceed to Payment' : 'Submit Booking Request'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Property Summary */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-xl font-bold text-primary mb-4">Booking Summary</h3>
              {property.images && property.images[0] && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <h4 className="font-bold text-white mb-2">{property.title}</h4>
              <p className="text-grey-light text-sm mb-4">{property.location.city}</p>
              
              <div className="space-y-3 border-t border-grey-dark pt-4">
                <div className="flex justify-between">
                  <span className="text-grey-light">Property Type</span>
                  <span className="text-white font-semibold">
                    {property.type === 'flat' 
                      ? `Flat${property.unit_type ? ` - ${property.unit_type.toUpperCase()}` : ''}` 
                      : 'Shop'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-light">Area</span>
                  <span className="text-white font-semibold">
                    {property.area && property.area > 0 ? `${property.area} sq.ft` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-light">Advance</span>
                  <span className="text-white font-semibold">
                    {property.advance ? formatCurrency(property.advance) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-grey-dark pt-3">
                  <span className="text-grey-light">Total Price / Rent</span>
                  <span className="text-primary text-2xl font-bold">{formatCurrency(dynamicRent || property.price)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
