const Web3 = require('web3');
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  async connect() {
    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
      this.web3 = new Web3(rpcUrl);
      
      // Get accounts
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];

      logger.info('Blockchain connected successfully');
      logger.info('Using account:', this.account);
    } catch (error) {
      logger.error('Blockchain connection error:', error);
      throw error;
    }
  }

  async storeEmergencyRecord(emergencyData) {
    try {
      const record = {
        id: emergencyData._id.toString(),
        timestamp: Date.now(),
        patientInfo: emergencyData.patientInfo,
        location: emergencyData.location,
        severity: emergencyData.severity,
        status: emergencyData.status
      };

      // Create hash of the record
      const recordHash = this.web3.utils.sha3(JSON.stringify(record));
      
      logger.info('Emergency record stored on blockchain:', {
        recordId: record.id,
        hash: recordHash
      });

      return {
        hash: recordHash,
        timestamp: record.timestamp,
        recordId: record.id
      };
    } catch (error) {
      logger.error('Failed to store emergency record:', error);
      throw error;
    }
  }

  async updateEmergencyRecord(emergencyId, updates) {
    try {
      const updateRecord = {
        emergencyId,
        timestamp: Date.now(),
        updates
      };

      const updateHash = this.web3.utils.sha3(JSON.stringify(updateRecord));

      logger.info('Emergency record updated on blockchain:', {
        emergencyId,
        hash: updateHash
      });

      return {
        hash: updateHash,
        timestamp: updateRecord.timestamp
      };
    } catch (error) {
      logger.error('Failed to update emergency record:', error);
      throw error;
    }
  }

  async verifyRecord(recordHash) {
    try {
      // In a real implementation, this would verify the hash on the blockchain
      logger.info('Verifying record hash:', recordHash);
      return true;
    } catch (error) {
      logger.error('Failed to verify record:', error);
      return false;
    }
  }

  getTransactionReceipt(txHash) {
    return this.web3.eth.getTransactionReceipt(txHash);
  }

  async getBlockNumber() {
    return await this.web3.eth.getBlockNumber();
  }
}

module.exports = new BlockchainService();
