import WebSocket from 'ws';
import axios from 'axios';
import winston from 'winston';
import { format } from 'logform';

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(info => `${info.timestamp} ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'pools_feed.log' })
    ]
});

async function poolsFeed() {
    const uri = "wss://stream.mcaps.com/ws/price";
    logger.info(`connect ${uri}`);
    try {
        const websocket = new WebSocket(uri);

        websocket.on('open', () => {
            logger.info(`Connected to ${uri}`);
        });

        websocket.on('message', (msg) => {

            const data = JSON.parse(msg);
            logger.info(`Token ${data.price.token}\tprice ${data.price.price_sol} \t amount SOL ${data.price.amount_sol} `);
        });

        websocket.on('error', (e) => {
            logger.error(`Failed to connect or an error occurred: ${e}`);
        });

        websocket.on('close', () => {
            logger.info(`Disconnected from ${uri}`);
        });

    } catch (e) {
        logger.error(`Failed to connect or an error occurred: ${e}`);
    }
}

function stream() {
    poolsFeed();
}

stream();
