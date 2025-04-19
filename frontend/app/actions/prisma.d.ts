import { Prisma } from '@prisma/client';

export type EventWithCreator = Prisma.EventGetPayload<{
  include: {
    createdBy: {
      select: {
        email: true;
      };
    };
  };
}>;

export type SerializedEvent = Omit<EventWithCreator, 'price'> & {
  price: number;
};

type EventCardProps = Pick<
  SerializedEvent,
  'title' | 'description' | 'date' | 'price' | 'image' | 'id'
> & {
  createdByEmail: string;
};
