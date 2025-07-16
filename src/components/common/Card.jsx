const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  ...props 
}) => {
  const baseClasses = 'bg-white transition-all duration-300';
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    none: 'p-0',
  };
  
  const roundeds = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    none: 'rounded-none',
  };
  
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl',
    none: 'shadow-none',
  };
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  
  const classes = `${baseClasses} ${paddings[padding]} ${roundeds[rounded]} ${shadows[shadow]} ${hoverClasses} ${className}`;
  
  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card; 