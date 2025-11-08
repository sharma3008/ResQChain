const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'resqchain-client',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ 
      groupId: process.env.KAFKA_GROUP_ID || 'resqchain-group' 
    });

    this.topics = {
      EMERGENCY_CREATED: 'emergency-created',
      EMERGENCY_UPDATED: 'emergency-updated',
      RESPONDER_ASSIGNED: 'responder-assigned',
      AMBULANCE_DISPATCHED: 'ambulance-dispatched',
      PATIENT_ARRIVED: 'patient-arrived',
      SEVERITY_PREDICTED: 'severity-predicted'
    };
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      
      // Subscribe to topics
      await this.consumer.subscribe({ 
        topics: Object.values(this.topics),
        fromBeginning: false 
      });

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          logger.info('Kafka message received:', {
            topic,
            partition,
            offset: message.offset,
            value: message.value.toString()
          });
        }
      });

      logger.info('Kafka connected successfully');
    } catch (error) {
      logger.error('Kafka connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      logger.info('Kafka disconnected');
    } catch (error) {
      logger.error('Kafka disconnect error:', error);
    }
  }

  async publishEvent(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
            timestamp: Date.now().toString()
          }
        ]
      });
      logger.info(`Event published to ${topic}:`, message);
    } catch (error) {
      logger.error('Failed to publish event:', error);
      throw error;
    }
  }

  async publishEmergencyCreated(emergency) {
    return this.publishEvent(this.topics.EMERGENCY_CREATED, emergency);
  }

  async publishEmergencyUpdated(emergency) {
    return this.publishEvent(this.topics.EMERGENCY_UPDATED, emergency);
  }

  async publishResponderAssigned(data) {
    return this.publishEvent(this.topics.RESPONDER_ASSIGNED, data);
  }

  async publishAmbulanceDispatched(data) {
    return this.publishEvent(this.topics.AMBULANCE_DISPATCHED, data);
  }

  async publishPatientArrived(data) {
    return this.publishEvent(this.topics.PATIENT_ARRIVED, data);
  }

  async publishSeverityPredicted(data) {
    return this.publishEvent(this.topics.SEVERITY_PREDICTED, data);
  }
}

module.exports = new KafkaService();
