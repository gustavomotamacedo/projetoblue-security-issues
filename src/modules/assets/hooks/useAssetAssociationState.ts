
import { useState, useEffect } from 'react';
import {
  AssetAssociationState,
  SelectedAsset,
} from '@modules/associations/types';
import type { Client } from '@/types/client';
import type { AssociationGeneralConfig } from '@modules/associations/components/association/AssociationGeneralConfig';

const STORAGE_KEY = 'asset_association_state';

export const useAssetAssociationState = () => {
  const [state, setState] = useState<AssetAssociationState>(() => {
    // Initialize from sessionStorage if available
    try {
      const savedState = sessionStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log('🔄 Restored asset association state from sessionStorage:', parsedState);

        if (parsedState.generalConfig) {
          parsedState.generalConfig.startDate = new Date(parsedState.generalConfig.startDate);
          if (parsedState.generalConfig.endDate) {
            parsedState.generalConfig.endDate = new Date(parsedState.generalConfig.endDate);
          }
        }

        return parsedState;
      }
    } catch (error) {
      console.warn('⚠️ Failed to restore asset association state from sessionStorage:', error);
    }
    
    // Default state com configuração inicial correta
    const defaultState: AssetAssociationState = {
      selectedAssets: [],
      currentStep: 'client' as const,
      isLoading: false,
      selectedClient: null,
      generalConfig: {
        associationType: 1, // Padrão: ALUGUEL (ID = 1)
        startDate: new Date(),
        endDate: undefined,
        notes: '',
        rentedDays: 0
      } as AssociationGeneralConfig
    };
    console.log('🆕 Initialized new asset association state:', defaultState);
    return defaultState;
  });

  // Persist state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('💾 Saved asset association state to sessionStorage:', state);
    } catch (error) {
      console.warn('⚠️ Failed to save asset association state to sessionStorage:', error);
    }
  }, [state]);

  const setCurrentStep = (step: 'client' | 'assets' | 'summary') => {
    console.log('📍 Changing step from', state.currentStep, 'to', step);
    setState(prevState => ({ ...prevState, currentStep: step }));
  };

  const setSelectedClient = (client: Client | null) => {
    console.log('👤 Setting selected client:', client);
    setState(prevState => ({ ...prevState, selectedClient: client }));
  };

  const setSelectedAssets = (assets: SelectedAsset[]) => {
    console.log('📦 Setting selected assets:', assets.length, 'assets');
    setState(prevState => ({ ...prevState, selectedAssets: assets }));
  };

  const setGeneralConfig = (config: AssociationGeneralConfig | null) => {
    console.log('⚙️ Setting general config:', config);
    setState(prevState => ({ ...prevState, generalConfig: config }));
  };

  // Validação para verificar se os dados estão completos
  const validateCurrentStep = (): boolean => {
    switch (state.currentStep) {
      case 'client':
        return !!state.selectedClient;
      case 'assets':
        return state.selectedAssets.length > 0;
      case 'summary':
        return !!(state.selectedClient && state.selectedAssets.length > 0 && state.generalConfig);
      default:
        return false;
    }
  };

  const clearState = () => {
    console.log('🗑️ Clearing asset association state');
    const defaultState: AssetAssociationState = {
      selectedAssets: [],
      currentStep: 'client' as const,
      isLoading: false,
      selectedClient: null,
      generalConfig: {
        associationType: 1,
        startDate: new Date(),
        endDate: undefined,
        notes: '',
        rentedDays: 0
      } as AssociationGeneralConfig
    };
    setState(defaultState);
    
    // Also clear from sessionStorage
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Cleared asset association state from sessionStorage');
    } catch (error) {
      console.warn('⚠️ Failed to clear asset association state from sessionStorage:', error);
    }
  };
  
  return {
    currentStep: state.currentStep,
    selectedClient: state.selectedClient,
    selectedAssets: state.selectedAssets,
    generalConfig: state.generalConfig,
    setCurrentStep,
    setSelectedClient,
    setSelectedAssets,
    setGeneralConfig,
    validateCurrentStep,
    clearState
  };
};
