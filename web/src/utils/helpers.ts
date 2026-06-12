export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getPropertyPriceDisplay = (property: any): string => {
  const rules = property?.project?.pricing_rules;
  if (rules) {
    let prices: number[] = [];
    if (property.type === 'shop' && rules.shop) {
      prices = Object.values(rules.shop).map(Number);
    } else if (property.type === 'flat' && rules.flat) {
      if (property.unit_type && rules.flat[property.unit_type]) {
        prices = Object.values(rules.flat[property.unit_type]).map(Number);
      } else {
        // Fallback: aggregate all flat rules for the project if unit_type is not set
        Object.values(rules.flat).forEach((unitRules: any) => {
          prices.push(...Object.values(unitRules).map(Number));
        });
      }
    }

    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) {
        return formatCurrency(min);
      }
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    }
  }

  return formatCurrency(property.price);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatPhone = (phone: string): string => {
  if (phone.startsWith('+91')) return phone;
  return `+91${phone}`;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getWhatsAppLink = (phone: string, message?: string): string => {
  const formattedPhone = formatPhone(phone).replace('+', '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
};

export const getCallLink = (phone: string): string => {
  return `tel:${formatPhone(phone)}`;
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
