import * as React from 'react'

interface LinkProps {
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Mock Next.js Link component
const Link: React.FC<LinkProps> = ({ 
  children, 
  href, 
  className, 
  onClick,
  ...props 
}) => {
  return (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  )
}

export default Link
