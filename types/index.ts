export type LocationResult = {
  address: string;
  phone: string;
  email: string;
  website: string;
};

export interface PageLoaderProps {
  children: React.ReactNode;
  showLoader?: boolean;
  duration?: number;
}

export interface ColdStartLoaderProps {
  onComplete?: () => void;
  duration?: number;
  message?: string;
}
