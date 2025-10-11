import { useCallback } from 'react';
import { 
  TradingToasts, 
  ApiToasts, 
  FormToasts, 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showLoading,
  showPromise,
  showCustom,
  dismissAll,
  dismiss
} from '@/lib/toast';

export const useToast = () => {
  // Trading-specific toasts
  const trading = useCallback({
    loginSuccess: TradingToasts.loginSuccess,
    loginError: TradingToasts.loginError,
    logoutSuccess: TradingToasts.logoutSuccess,
    strategySaved: TradingToasts.strategySaved,
    strategyDeleted: TradingToasts.strategyDeleted,
    strategyError: TradingToasts.strategyError,
    backtestStarted: TradingToasts.backtestStarted,
    backtestCompleted: TradingToasts.backtestCompleted,
    backtestError: TradingToasts.backtestError,
    botGenerated: TradingToasts.botGenerated,
    botDownloaded: TradingToasts.botDownloaded,
    botError: TradingToasts.botError,
    dataLoaded: TradingToasts.dataLoaded,
    indicatorAdded: TradingToasts.indicatorAdded,
    indicatorRemoved: TradingToasts.indicatorRemoved,
    indicatorError: TradingToasts.indicatorError,
    orderPlaced: TradingToasts.orderPlaced,
    orderCancelled: TradingToasts.orderCancelled,
    positionOpened: TradingToasts.positionOpened,
    positionClosed: TradingToasts.positionClosed,
    connectionLost: TradingToasts.connectionLost,
    connectionRestored: TradingToasts.connectionRestored,
    updateAvailable: TradingToasts.updateAvailable,
    validationError: TradingToasts.validationError,
    requiredField: TradingToasts.requiredField,
    invalidValue: TradingToasts.invalidValue,
    performanceWarning: TradingToasts.performanceWarning,
    optimizationComplete: TradingToasts.optimizationComplete,
    riskWarning: TradingToasts.riskWarning,
  }, []);

  // API-specific toasts
  const api = useCallback({
    requestStarted: ApiToasts.requestStarted,
    requestSuccess: ApiToasts.requestSuccess,
    requestError: ApiToasts.requestError,
    networkError: ApiToasts.networkError,
    serverError: ApiToasts.serverError,
    unauthorized: ApiToasts.unauthorized,
    forbidden: ApiToasts.forbidden,
    notFound: ApiToasts.notFound,
    rateLimited: ApiToasts.rateLimited,
  }, []);

  // Form-specific toasts
  const form = useCallback({
    formSaved: FormToasts.formSaved,
    formError: FormToasts.formError,
    formValidation: FormToasts.formValidation,
    formReset: FormToasts.formReset,
    formDirty: FormToasts.formDirty,
  }, []);

  // Generic toasts
  const generic = useCallback({
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    custom: showCustom,
    dismissAll,
    dismiss,
  }, []);

  return {
    trading,
    api,
    form,
    generic,
  };
};

export default useToast;
