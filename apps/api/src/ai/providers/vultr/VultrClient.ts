import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Custom Vultr API client that directly uses the Vultr API endpoints
 * @see https://www.vultr.com/api/
 */
export class VultrClient {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.vultr.com/v2';
  private readonly client: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Check if the API connection is working
   * @returns True if the connection is working, false otherwise
   */
  async checkConnection(): Promise<boolean> {
    try {
      console.log('Checking Vultr API connection...');
      // Try to get account info as a simple API test
      const response = await this.client.get('/account');
      console.log('Vultr API connection successful');
      return true;
    } catch (error: any) {
      console.error('Vultr API connection check failed:', error.message);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Response Status:', error.response.status);
        console.error('API Response Data:', error.response.data);

        if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication failed. Please check your API key.');
          if (error.response.data?.error?.includes('Unauthorized IP address')) {
            console.error(
              'Your IP address is not authorized to access the Vultr API.',
            );
            console.error(
              'Please add your IP to the allowed list in your Vultr account settings:',
            );
            console.error('https://my.vultr.com/settings/#settingsapi');
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(
          'No response received from Vultr API. Network error or service unavailable.',
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }

      return false;
    }
  }

  /**
   * List all instances
   * @see https://www.vultr.com/api/#tag/instances/operation/list-instances
   */
  async listInstances() {
    try {
      console.log('Making API request to list instances...');
      const response = await this.client.get('/instances');
      console.log('Instances list API request successful');
      return response.data;
    } catch (error: any) {
      console.error('Error in listInstances API call:', error);
      this.handleApiError('listInstances', error);
    }
  }

  /**
   * Get a specific instance by ID
   * @see https://www.vultr.com/api/#tag/instances/operation/get-instance
   */
  async getInstance(instanceId: string) {
    try {
      console.log(`Making API request to get instance ${instanceId}...`);
      const response = await this.client.get(`/instances/${instanceId}`);
      console.log('Get instance API request successful');
      return response.data;
    } catch (error: any) {
      console.error(`Error in getInstance API call for ${instanceId}:`, error);
      this.handleApiError('getInstance', error);
    }
  }

  /**
   * Create a new instance
   * @see https://www.vultr.com/api/#tag/instances/operation/create-instance
   */
  async createInstance(params: {
    region: string;
    plan: string;
    os_id?: number;
    snapshot_id?: string;
    hostname?: string;
    label?: string;
    sshkey_id?: string[];
    enable_ipv6?: boolean;
    backups?: string;
    ddos_protection?: boolean;
    activation_email?: boolean;
    user_data?: string;
    [key: string]: any;
  }) {
    try {
      console.log('Making API request to create instance...');
      console.log('Create instance params:', JSON.stringify(params, null, 2));
      const response = await this.client.post('/instances', params);
      console.log('Create instance API request successful');
      return response.data;
    } catch (error: any) {
      console.error('Error in createInstance API call:', error);
      this.handleApiError('createInstance', error);
    }
  }

  /**
   * Delete an instance
   * @see https://www.vultr.com/api/#tag/instances/operation/delete-instance
   */
  async deleteInstance(instanceId: string) {
    try {
      const response = await this.client.delete(`/instances/${instanceId}`);
      return response.data;
    } catch (error) {
      this.handleApiError('deleteInstance', error);
    }
  }

  /**
   * Start an instance
   * @see https://www.vultr.com/api/#tag/instances/operation/start-instance
   */
  async startInstance(instanceId: string) {
    try {
      const response = await this.client.post(`/instances/${instanceId}/start`);
      return response.data;
    } catch (error) {
      this.handleApiError('startInstance', error);
    }
  }

  /**
   * Reboot an instance
   * @see https://www.vultr.com/api/#tag/instances/operation/reboot-instance
   */
  async rebootInstance(instanceId: string) {
    try {
      const response = await this.client.post(
        `/instances/${instanceId}/reboot`,
      );
      return response.data;
    } catch (error) {
      this.handleApiError('rebootInstance', error);
    }
  }

  /**
   * Halt (stop) an instance
   * @see https://www.vultr.com/api/#tag/instances/operation/halt-instance
   */
  async haltInstance(instanceId: string) {
    try {
      const response = await this.client.post(`/instances/${instanceId}/halt`);
      return response.data;
    } catch (error) {
      this.handleApiError('haltInstance', error);
    }
  }

  /**
   * List all SSH keys
   * @see https://www.vultr.com/api/#tag/ssh/operation/list-ssh-keys
   */
  async listSshKeys() {
    try {
      console.log('Making API request to list SSH keys...');
      const response = await this.client.get('/ssh-keys');
      console.log('SSH keys list API request successful');
      return response.data;
    } catch (error: any) {
      console.error('Error in listSshKeys API call:', error);

      // Check if it's a network error
      if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ETIMEDOUT'
      ) {
        console.error(
          `Network error (${error.code}): Unable to connect to Vultr API`,
        );
        throw new Error(
          `Network error: Unable to connect to Vultr API. Please check your internet connection and try again.`,
        );
      }

      this.handleApiError('listSshKeys', error);
    }
  }

  /**
   * Create a new SSH key
   * @see https://www.vultr.com/api/#tag/ssh/operation/create-ssh-key
   */
  async createSshKey(params: { name: string; ssh_key: string }) {
    try {
      console.log(`Making API request to create SSH key "${params.name}"...`);
      const response = await this.client.post('/ssh-keys', params);
      console.log('Create SSH key API request successful');
      return response.data;
    } catch (error: any) {
      console.error('Error in createSshKey API call:', error);
      this.handleApiError('createSshKey', error);
    }
  }

  /**
   * Get a specific SSH key by ID
   * @see https://www.vultr.com/api/#tag/ssh/operation/get-ssh-key
   */
  async getSshKey(sshKeyId: string) {
    try {
      const response = await this.client.get(`/ssh-keys/${sshKeyId}`);
      return response.data;
    } catch (error) {
      this.handleApiError('getSshKey', error);
    }
  }

  /**
   * Delete an SSH key
   * @see https://www.vultr.com/api/#tag/ssh/operation/delete-ssh-key
   */
  async deleteSshKey(sshKeyId: string) {
    try {
      const response = await this.client.delete(`/ssh-keys/${sshKeyId}`);
      return response.data;
    } catch (error) {
      this.handleApiError('deleteSshKey', error);
    }
  }

  /**
   * List all available plans
   * @see https://www.vultr.com/api/#tag/plans/operation/list-plans
   */
  async listPlans() {
    try {
      const response = await this.client.get('/plans');
      return response.data;
    } catch (error) {
      this.handleApiError('listPlans', error);
    }
  }

  /**
   * List all available regions
   * @see https://www.vultr.com/api/#tag/regions/operation/list-regions
   */
  async listRegions() {
    try {
      const response = await this.client.get('/regions');
      return response.data;
    } catch (error) {
      this.handleApiError('listRegions', error);
    }
  }

  /**
   * List all available operating systems
   * @see https://www.vultr.com/api/#tag/os/operation/list-os
   */
  async listOperatingSystems() {
    try {
      const response = await this.client.get('/os');
      return response.data;
    } catch (error) {
      this.handleApiError('listOperatingSystems', error);
    }
  }

  /**
   * Handle API errors
   */
  private handleApiError(method: string, error: any): never {
    console.log(`Handling API error in ${method}:`, error);

    // If it's an axios error with a response
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      let message = `Vultr API error in ${method}: `;

      if (status === 401 || status === 403) {
        if (data?.error && data.error.includes('Unauthorized IP address')) {
          message += `${data.error}. You need to add your current IP address to the allowed list in your Vultr account settings: https://my.vultr.com/settings/#settingsapi`;
        } else {
          message += 'Authentication failed. Please check your API key.';
        }
      } else if (status === 404) {
        message += 'Resource not found.';
      } else if (status === 429) {
        message += 'Rate limit exceeded. Please try again later.';
      } else if (data && data.error) {
        message += data.error;
      } else {
        message += `Unexpected response (status ${status})`;
      }

      console.error(message, { status, data });
      throw new Error(message);
    }
    // If it's a network error or other axios error without a response
    else if (error.request) {
      const message = `Vultr API error in ${method}: Network error - no response received. Please check your internet connection.`;
      console.error(message, { error: error.message });
      throw new Error(message);
    }
    // For any other type of error
    else {
      const message = `Vultr API error in ${method}: ${
        error.message || 'Unknown error'
      }`;
      console.error(message);
      throw new Error(message);
    }
  }
}
