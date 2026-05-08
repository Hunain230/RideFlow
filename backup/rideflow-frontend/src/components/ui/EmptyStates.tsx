import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Search, AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';

interface EmptyStateProps {
  type: 'no-locations' | 'no-vehicles' | 'no-rides' | 'no-results' | 'error';
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-locations':
        return {
          icon: <MapPin className="text-amber-500" size={48} />,
          title: title || 'No Locations Available',
          description: description || 'We couldn\'t find any locations. Please try again later or contact support.',
          action: action || <Button onClick={() => window.location.reload()}>Refresh</Button>
        };
      
      case 'no-vehicles':
        return {
          icon: <Car className="text-soft-gold" size={48} />,
          title: title || 'No Vehicles Available',
          description: description || 'No vehicles are currently available in your area. Please try again in a few minutes.',
          action: action || <Button onClick={() => window.location.reload()}>Check Again</Button>
        };
      
      case 'no-rides':
        return {
          icon: <Clock className="text-text-muted" size={48} />,
          title: title || 'No Ride History',
          description: description || 'You haven\'t taken any rides yet. Book your first ride to get started!',
          action: action || <Button onClick={() => {}}>Book First Ride</Button>
        };
      
      case 'no-results':
        return {
          icon: <Search className="text-text-muted" size={48} />,
          title: title || 'No Results Found',
          description: description || 'We couldn\'t find what you\'re looking for. Try adjusting your search criteria.',
          action: action || <Button onClick={() => {}}>Clear Search</Button>
        };
      
      case 'error':
        return {
          icon: <AlertCircle className="text-red-500" size={48} />,
          title: title || 'Something Went Wrong',
          description: description || 'We encountered an error. Please try again or contact support if the problem persists.',
          action: action || <Button onClick={() => window.location.reload()}>Try Again</Button>
        };
      
      default:
        return {
          icon: <AlertCircle className="text-text-muted" size={48} />,
          title: title || 'Nothing Here',
          description: description || 'There\'s nothing to show right now.',
          action: action
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <GlassCard tier={2} className="p-8 text-center max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-glass-bg-light border border-glass-border"
      >
        {content.icon}
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-display mb-3 text-white">{content.title}</h3>
        <p className="text-text-muted mb-6">{content.description}</p>
        {content.action && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {content.action}
          </motion.div>
        )}
      </motion.div>
    </GlassCard>
  );
}

export function EmptyLocationGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.3, scale: 0.9 }}
          className="h-32 bg-glass-bg-light border border-glass-border rounded-lg flex items-center justify-center"
        >
          <MapPin className="text-text-muted/30" size={24} />
        </motion.div>
      ))}
    </div>
  );
}

export function EmptyVehicleGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Economy', 'Business', 'Bike'].map((type, i) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.3, scale: 0.9 }}
          transition={{ delay: i * 0.1 }}
          className="h-64 bg-glass-bg-light border border-glass-border rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-4xl mb-2 opacity-30">
              {type === 'Bike' ? '🏍️' : type === 'Business' ? '💼' : '🚗'}
            </div>
            <div className="text-white/30 font-medium">{type}</div>
            <div className="text-text-muted/30 text-sm">Unavailable</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
