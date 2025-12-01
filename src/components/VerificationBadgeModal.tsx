// @ts-nocheck
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationBadgeModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Rozet Satın Al</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-blue-50 cursor-pointer">
            <div className="flex items-center gap-3">
                <CheckCircle className="text-blue-500 h-8 w-8" />
                <div>
                    <h3 className="font-bold">Mavi Tik</h3>
                    <p className="text-sm text-gray-500">Onaylı Hesap Rozeti</p>
                </div>
            </div>
            <div className="font-bold text-blue-600">99₺ / ay</div>
          </div>

          <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-amber-50 cursor-pointer border-amber-200">
            <div className="flex items-center gap-3">
                <Crown className="text-amber-500 h-8 w-8" />
                <div>
                    <h3 className="font-bold">Altın Rozet</h3>
                    <p className="text-sm text-gray-500">Premium Üyelik</p>
                </div>
            </div>
            <div className="font-bold text-amber-600">299₺ / ay</div>
          </div>
        </div>
        <Button onClick={onClose} className="w-full">Kapat</Button>
      </DialogContent>
    </Dialog>
  );
}
