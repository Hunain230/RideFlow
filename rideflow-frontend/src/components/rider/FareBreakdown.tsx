import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Tag,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FareBreakdownProps {
  fareData: {
    baseFare: number;
    distanceFare: number;
    distance: number;
    perKmRate: number;
    subtotal: number;
    surgeMultiplier: number;
    surgeAmount: number;
    discount: number;
    total: number;
  };
  promoCode?: string;
  onApplyPromo?: (code: string) => void;
  compact?: boolean;
}

export const FareBreakdown: React.FC<FareBreakdownProps> = ({ 
  fareData, 
  promoCode, 
  onApplyPromo,
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [promoInput, setPromoInput] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleApplyPromo = () => {
    if (promoInput.trim() && onApplyPromo) {
      onApplyPromo(promoInput.trim().toUpperCase());
      setPromoInput('');
      setShowPromoInput(false);
    }
  };

  const hasSurge = fareData.surgeMultiplier > 1;
  const hasDiscount = fareData.discount > 0;

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Fare Breakdown</span>
            {hasSurge && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                Surge x{fareData.surgeMultiplier}
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                -PKR {fareData.discount.toFixed(0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900">
              PKR {fareData.total.toFixed(2)}
            </span>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>
        
        {isExpanded && (
          <div className="p-4 space-y-3">
            <FareDetails fareData={fareData} />
            {onApplyPromo && (
              <PromoCodeSection 
                promoCode={promoCode}
                promoInput={promoInput}
                setPromoInput={setPromoInput}
                showPromoInput={showPromoInput}
                setShowPromoInput={setShowPromoInput}
                onApply={handleApplyPromo}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calculator className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Fare Breakdown</h3>
          <p className="text-sm text-gray-500">Detailed pricing for your ride</p>
        </div>
      </div>

      <FareDetails fareData={fareData} />

      {onApplyPromo && (
        <PromoCodeSection 
          promoCode={promoCode}
          promoInput={promoInput}
          setPromoInput={setPromoInput}
          showPromoInput={showPromoInput}
          setShowPromoInput={setShowPromoInput}
          onApply={handleApplyPromo}
        />
      )}
    </div>
  );
};

const FareDetails: React.FC<{ fareData: FareBreakdownProps['fareData'] }> = ({ fareData }) => {
  const hasSurge = fareData.surgeMultiplier > 1;
  const hasDiscount = fareData.discount > 0;

  return (
    <div className="space-y-2">
      {/* Base Fare */}
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Tag className="w-4 h-4 text-gray-500" />
          </div>
          <span>Base Fare</span>
        </div>
        <span className="font-medium">PKR {fareData.baseFare.toFixed(2)}</span>
      </div>

      {/* Distance Fare */}
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <span>Distance</span>
            <span className="text-xs text-gray-400 block">
              {fareData.distance.toFixed(1)} km × PKR {fareData.perKmRate}/km
            </span>
          </div>
        </div>
        <span className="font-medium">PKR {fareData.distanceFare.toFixed(2)}</span>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center py-2 border-t border-gray-100">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">PKR {fareData.subtotal.toFixed(2)}</span>
      </div>

      {/* Surge Pricing */}
      {hasSurge && (
        <div className="flex justify-between items-center py-2 bg-red-50 rounded-lg px-3">
          <div className="flex items-center gap-2 text-red-700">
            <Zap className="w-4 h-4" />
            <div>
              <span className="font-medium">Surge Pricing</span>
              <span className="text-xs block">
                ×{fareData.surgeMultiplier.toFixed(1)} demand multiplier
              </span>
            </div>
          </div>
          <span className="font-semibold text-red-700">
            +PKR {fareData.surgeAmount.toFixed(2)}
          </span>
        </div>
      )}

      {/* Discount */}
      {hasDiscount && (
        <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3">
          <div className="flex items-center gap-2 text-green-700">
            <Tag className="w-4 h-4" />
            <span className="font-medium">Promo Discount</span>
          </div>
          <span className="font-semibold text-green-700">
            -PKR {fareData.discount.toFixed(2)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 mt-2">
        <span className="text-lg font-semibold text-gray-900">Total Fare</span>
        <span className="text-2xl font-bold text-blue-600">
          PKR {fareData.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const PromoCodeSection: React.FC<{
  promoCode?: string;
  promoInput: string;
  setPromoInput: (value: string) => void;
  showPromoInput: boolean;
  setShowPromoInput: (value: boolean) => void;
  onApply: () => void;
}> = ({ promoCode, promoInput, setPromoInput, showPromoInput, setShowPromoInput, onApply }) => {
  if (promoCode) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
        <div className="p-2 bg-green-100 rounded-full">
          <Tag className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1">
          <span className="font-medium text-green-800">{promoCode}</span>
          <span className="text-sm text-green-600 block">Promo code applied</span>
        </div>
      </div>
    );
  }

  if (!showPromoInput) {
    return (
      <button
        onClick={() => setShowPromoInput(true)}
        className="w-full flex items-center gap-2 justify-center py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Tag className="w-4 h-4" />
        <span>Have a promo code?</span>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
          onKeyPress={(e) => e.key === 'Enter' && onApply()}
        />
        <button
          onClick={onApply}
          disabled={!promoInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      <button
        onClick={() => setShowPromoInput(false)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
};

export default FareBreakdown;
