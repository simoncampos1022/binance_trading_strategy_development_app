import toast from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string;
  style?: React.CSSProperties;
  className?: string;
}

// Success toast with custom styling
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration || 3000,
    position: options?.position || 'top-right',
    style: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: '#FFFFFF',
      fontWeight: '500',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '400px',
      minWidth: '300px',
      boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Error toast with custom styling
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration || 5000,
    position: options?.position || 'top-right',
    style: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: '#FFFFFF',
      fontWeight: '500',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '400px',
      minWidth: '300px',
      boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Warning toast with custom styling
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: options?.duration || 4000,
    position: options?.position || 'top-right',
    icon: '⚠️',
    style: {
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      color: '#FFFFFF',
      fontWeight: '500',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '400px',
      minWidth: '300px',
      boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Info toast with custom styling
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: options?.duration || 4000,
    position: options?.position || 'top-right',
    icon: 'ℹ️',
    style: {
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: '#FFFFFF',
      fontWeight: '500',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '400px',
      minWidth: '300px',
      boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Loading toast with custom styling
export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    duration: Infinity,
    position: options?.position || 'top-right',
    style: {
      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
      color: '#FFFFFF',
      fontWeight: '500',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '400px',
      minWidth: '300px',
      boxShadow: '0 20px 25px -5px rgba(107, 114, 128, 0.1), 0 10px 10px -5px rgba(107, 114, 128, 0.04)',
      border: '1px solid rgba(107, 114, 128, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Promise toast for async operations
export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: ToastOptions
) => {
  return toast.promise(promise, messages, {
    duration: options?.duration || 4000,
    position: options?.position || 'top-right',
    style: {
      borderRadius: '8px',
      padding: '12px 16px',
      fontWeight: '500',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Custom toast with icon and styling
export const showCustom = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  options?: ToastOptions
) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  };

  return toast(message, {
    duration: options?.duration || 4000,
    position: options?.position || 'top-right',
    icon: options?.icon || icons[type],
    style: {
      background: colors[type],
      color: '#FFFFFF',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '12px 16px',
      ...options?.style,
    },
    className: options?.className,
  });
};

// Dismiss all toasts
export const dismissAll = () => {
  toast.dismiss();
};

// Dismiss specific toast
export const dismiss = (toastId: string) => {
  toast.dismiss(toastId);
};

// Trading-specific toast messages
export const TradingToasts = {
  // Authentication
  loginSuccess: () => showSuccess('Successfully signed in!', { duration: 3000 }),
  loginError: (error?: string) => showError(error || 'Login failed. Please try again.'),
  logoutSuccess: () => showInfo('Successfully signed out!', { duration: 2000 }),
  
  // Strategy Management
  strategySaved: (name: string) => showSuccess(`Strategy "${name}" saved successfully!`),
  strategyDeleted: (name: string) => showInfo(`Strategy "${name}" deleted.`),
  strategyError: (error?: string) => showError(error || 'Failed to save strategy. Please try again.'),
  
  // Backtesting
  backtestStarted: () => showLoading('Running backtest... This may take a few moments.'),
  backtestCompleted: (duration: string) => showSuccess(`Backtest completed in ${duration}!`),
  backtestError: (error?: string) => showError(error || 'Backtest failed. Please check your strategy.'),
  
  // Bot Generation
  botGenerated: (language: string) => showSuccess(`${language} bot generated successfully!`),
  botDownloaded: (name: string) => showSuccess(`Bot "${name}" downloaded!`),
  botError: (error?: string) => showError(error || 'Failed to generate bot. Please try again.'),
  
  // Data & Indicators
  dataLoaded: (symbol: string) => showInfo(`Market data loaded for ${symbol}`),
  indicatorAdded: (name: string) => showSuccess(`${name} indicator added to strategy`),
  indicatorRemoved: (name: string) => showInfo(`${name} indicator removed`),
  indicatorError: (name: string) => showError(`Failed to calculate ${name} indicator`),
  
  // Trading Operations
  orderPlaced: (symbol: string, side: string) => showSuccess(`${side} order placed for ${symbol}`),
  orderCancelled: (symbol: string) => showInfo(`Order cancelled for ${symbol}`),
  positionOpened: (symbol: string) => showSuccess(`Position opened for ${symbol}`),
  positionClosed: (symbol: string, pnl: number) => showSuccess(`Position closed for ${symbol}. P&L: ${pnl > 0 ? '+' : ''}${pnl.toFixed(2)}`),
  
  // System Notifications
  connectionLost: () => showWarning('Connection lost. Attempting to reconnect...', { duration: 0 }),
  connectionRestored: () => showSuccess('Connection restored!'),
  updateAvailable: () => showInfo('New update available. Please refresh the page.'),
  
  // Validation Messages
  validationError: (field: string) => showError(`Please check ${field} and try again.`),
  requiredField: (field: string) => showWarning(`${field} is required.`),
  invalidValue: (field: string) => showError(`Invalid value for ${field}.`),
  
  // Performance Messages
  performanceWarning: (message: string) => showWarning(`Performance: ${message}`),
  optimizationComplete: () => showSuccess('Strategy optimization completed!'),
  riskWarning: (message: string) => showWarning(`Risk Alert: ${message}`),
};

// API-specific toast messages
export const ApiToasts = {
  requestStarted: (action: string) => showLoading(`Processing ${action}...`),
  requestSuccess: (action: string) => showSuccess(`${action} completed successfully!`),
  requestError: (action: string, error?: string) => showError(`${action} failed: ${error || 'Unknown error'}`),
  networkError: () => showError('Network error. Please check your connection.'),
  serverError: () => showError('Server error. Please try again later.'),
  unauthorized: () => showError('Unauthorized. Please log in again.'),
  forbidden: () => showError('Access denied. You don\'t have permission for this action.'),
  notFound: () => showError('Resource not found.'),
  rateLimited: () => showWarning('Too many requests. Please wait a moment.'),
};

// Form-specific toast messages
export const FormToasts = {
  formSaved: (formName: string) => showSuccess(`${formName} saved successfully!`),
  formError: (formName: string) => showError(`Failed to save ${formName}. Please try again.`),
  formValidation: (errors: string[]) => showError(`Please fix: ${errors.join(', ')}`),
  formReset: () => showInfo('Form reset to default values.'),
  formDirty: () => showWarning('You have unsaved changes. Are you sure you want to leave?'),
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  showPromise,
  showCustom,
  dismissAll,
  dismiss,
  TradingToasts,
  ApiToasts,
  FormToasts,
};
