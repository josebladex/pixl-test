'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDaysIcon, DollarSignIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useAuth } from '@/providers/auth-provider';

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  price: number;
  image?: string;
  createdByEmail: string;
  transactions?: { userId: number }[];
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  price,
  image,
  createdByEmail,
  transactions = [],
}) => {
  const { user } = useAuth();

  const hasPurchased =
    Array.isArray(transactions) &&
    transactions.some((transaction) => transaction.userId === user?.id);

  const handleBuy = async () => {
    if (!hasPurchased) {
      toast.promise(
        async () => {
          const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventId: id,
              price,
              title,
              description,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create payment preference');
          }

          const { initPoint } = await response.json();
          window.location.href = initPoint;
        },
        {
          loading: 'Processing payment...',
          success: 'Redirecting to Mercado Pago!',
          error: 'Failed to initiate payment. Please try again.',
        }
      );
    }
  };

  const formattedDate = format(new Date(date), 'MM/dd/yyyy'); 

  return (
    <Card className="w-full max-w-[300px]">
      {image ? (
        <Image
          src={image}
          alt="Event Image"
          className="rounded-t-lg object-cover"
          width="400"
          height="200"
          style={{ aspectRatio: '400/200', objectFit: 'cover' }}
        />
      ) : (
        <div className="h-[200px] bg-gray-200 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}
      <CardContent className="p-4 space-y-2">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CalendarDaysIcon className="w-4 h-4" />
            <Label>{formattedDate}</Label>
            <DollarSignIcon className="w-4 h-4" />
            <Label>${price.toFixed(2)}</Label>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <Button
          className="w-full"
          onClick={handleBuy}
          disabled={hasPurchased} 
        >
          {hasPurchased ? 'Purchased' : 'Buy Now'}
        </Button>
      </CardContent>
      <CardFooter>
        <div className="p-2">
          <Badge className="text-sm">Created by: {createdByEmail}</Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
