export const STATUS_LABELS = {
  pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  ready: 'Ready', completed: 'Completed', cancelled: 'Cancelled',
  paid: 'Paid', unpaid: 'Unpaid', refunded: 'Refunded',
};

export const STATUS_COLORS = {
  pending: 'text-warning bg-warning/15 border-warning/30',
  confirmed: 'text-primary bg-primary/15 border-primary/30',
  preparing: 'text-primary bg-primary/15 border-primary/30',
  ready: 'text-success bg-success/15 border-success/30',
  completed: 'text-success bg-success/15 border-success/30',
  cancelled: 'text-danger bg-danger/15 border-danger/30',
  paid: 'text-success bg-success/15 border-success/30',
  unpaid: 'text-warning bg-warning/15 border-warning/30',
  refunded: 'text-info bg-info/15 border-info/30',
};

export const NEXT_STATUS = {
  pending: { label: 'Accept & Fire', next: 'confirmed', variant: 'primary' },
  confirmed: { label: 'Start Preparing', next: 'preparing', variant: 'primary' },
  preparing: { label: 'Mark Ready', next: 'ready', variant: 'warning' },
  ready: { label: 'Complete', next: 'completed', variant: 'success' },
};