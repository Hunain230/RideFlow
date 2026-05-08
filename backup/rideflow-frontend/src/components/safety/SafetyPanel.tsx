import { useState } from 'react';
import { Phone, Share2, Shield, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { toast } from '../ui/Toast';
import { riderAPI } from '../../lib/rider';

interface SafetyPanelProps {
  rideID?: number;
  className?: string;
}

export function SafetyPanel({ rideID, className }: SafetyPanelProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({ shareWith: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    if (!confirm('Are you sure you want to trigger SOS? This will alert your emergency contacts.')) {
      return;
    }

    setLoading(true);
    try {
      // Get current location (simplified - in real app would use GPS)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await riderAPI.triggerSOS({
        rideID: rideID || null,
        locationLat: position.coords.latitude,
        locationLng: position.coords.longitude
      });

      toast.success('SOS alert triggered! Emergency contacts have been notified.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to trigger SOS');
    } finally {
      setLoading(false);
    }
  };

  const handleShareTrip = async () => {
    if (!shareData.shareWith) {
      toast.error('Please enter who to share with');
      return;
    }

    if (!rideID) {
      toast.error('No active ride to share');
      return;
    }

    setLoading(true);
    try {
      const res = await riderAPI.shareTrip({
        rideID,
        shareWith: shareData.shareWith,
        message: shareData.message
      });

      toast.success(`Trip shared with ${shareData.shareWith}`);
      setShowShareModal(false);
      setShareData({ shareWith: '', message: '' });
      
      // Copy share link to clipboard
      if (res.data.data.shareLink) {
        navigator.clipboard.writeText(res.data.data.shareLink);
        toast.success('Share link copied to clipboard!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to share trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <GlassCard tier={2} className="p-6">
        <h3 className="text-xl font-display mb-6 flex items-center gap-2">
          <Shield className="text-amber-500" size={24} />
          Safety Features
        </h3>
        
        <div className="space-y-4">
          {/* SOS Button */}
          <Button
            variant="glass"
            className="w-full bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30 flex items-center gap-3"
            onClick={handleSOS}
            loading={loading}
          >
            <AlertTriangle size={20} />
            <span className="font-semibold">Emergency SOS</span>
          </Button>

          {/* Share Trip */}
          <Button
            variant="glass"
            className="w-full flex items-center gap-3"
            onClick={() => setShowShareModal(true)}
            disabled={!rideID}
          >
            <Share2 size={20} />
            <span>Share Trip Status</span>
          </Button>

          {/* Emergency Contacts */}
          <div className="pt-4 border-t border-glass-border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Phone size={16} />
              Emergency Contacts
            </h4>
            <p className="text-sm text-text-muted mb-3">
              Manage your emergency contacts for SOS alerts
            </p>
            <Button variant="glass" size="sm" className="w-full">
              Manage Contacts
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Share Trip Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <GlassCard tier={3} className="p-6 max-w-md w-full">
            <h3 className="text-xl font-display mb-4">Share Trip Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Share with (Email/Phone)
                </label>
                <input
                  type="text"
                  className="w-full bg-glass-bg border border-glass-border rounded-radius-md px-3 py-2 text-white outline-none"
                  placeholder="Enter email or phone number"
                  value={shareData.shareWith}
                  onChange={(e) => setShareData({ ...shareData, shareWith: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Message (optional)
                </label>
                <textarea
                  className="w-full bg-glass-bg border border-glass-border rounded-radius-md px-3 py-2 text-white outline-none resize-none"
                  placeholder="Add a message..."
                  rows={3}
                  value={shareData.message}
                  onChange={(e) => setShareData({ ...shareData, message: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="glass" className="flex-1" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleShareTrip} loading={loading}>
                Share Trip
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
