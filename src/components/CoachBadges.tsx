import { BadgeCheck, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CoachBadgesProps {
  isPremium?: boolean;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoachBadges({ isPremium, isVerified, size = 'md' }: CoachBadgesProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  const badgeSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center gap-2">
      {isPremium && (
        <Badge 
          variant="secondary" 
          className={`bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 ${badgeSize} flex items-center gap-1`}
        >
          <Crown className={iconSize} />
          Premium
        </Badge>
      )}
      {isVerified && (
        <Badge 
          variant="secondary" 
          className={`bg-blue-500 text-white border-0 ${badgeSize} flex items-center gap-1`}
        >
          <BadgeCheck className={iconSize} />
          ICF Onaylı
        </Badge>
      )}
    </div>
  );
}