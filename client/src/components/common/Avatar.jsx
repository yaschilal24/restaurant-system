import { getInitials } from '../../utils/helpers';

export default function Avatar({ name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };
  return (
    <div className={`${sizes[size]} rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary ${className}`}>
      {getInitials(name)}
    </div>
  );
}