import { AptosClient } from 'aptos';

const MODULE_ADDRESS = '0x0726ea2567b15ba4d1e62a379a677ba2cacab96401dd8b187486fe3a97057b70';
const MODULE_NAME = 'escrow';

export class ContractService {
  constructor(private client: AptosClient) {}

  async createEscrow(
    wallet: any,
    contractor: string,
    amount: number,
    durationHours: number
  ) {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::create_escrow`,
        type_arguments: [],
        arguments: [contractor, amount, durationHours],
      };

      const response = await wallet.signAndSubmitTransaction(payload);
      await this.client.waitForTransaction(response.hash);
      return response;
    } catch (error: any) {
      console.error('Create escrow error:', error);
      throw new Error(error.message || 'Failed to create escrow');
    }
  }

  async claim(wallet: any) {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::claim`,
        type_arguments: [],
        arguments: [],
      };

      const response = await wallet.signAndSubmitTransaction(payload);
      await this.client.waitForTransaction(response.hash);
      return response;
    } catch (error: any) {
      console.error('Claim error:', error);
      throw new Error(error.message || 'Failed to claim');
    }
  }

  async approveContinueClient(wallet: any) {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::approve_continue_client`,
        type_arguments: [],
        arguments: [],
      };

      const response = await wallet.signAndSubmitTransaction(payload);
      await this.client.waitForTransaction(response.hash);
      return response;
    } catch (error: any) {
      console.error('Approve continue client error:', error);
      throw new Error(error.message || 'Failed to approve');
    }
  }

  async approveContinueContractor(wallet: any) {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::approve_continue_contractor`,
        type_arguments: [],
        arguments: [],
      };

      const response = await wallet.signAndSubmitTransaction(payload);
      await this.client.waitForTransaction(response.hash);
      return response;
    } catch (error: any) {
      console.error('Approve continue contractor error:', error);
      throw new Error(error.message || 'Failed to approve');
    }
  }
} 