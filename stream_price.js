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
    let eventCount = 0;
    let lastLogTime = Date.now();

    try {
        const websocket = new WebSocket(uri);

        websocket.on('open', () => {
            logger.info(`Connected to ${uri}`);
        });

        websocket.on('message', (msg) => {
            eventCount++;
            const data = JSON.parse(msg);
            logger.info(`Token ${data.token}\tprice ${data.price_sol} \t amount SOL ${data.amount_sol} `);

            const currentTime = Date.now();
            if (currentTime - lastLogTime >= 5000) {
                const eventsPerSecond = (eventCount / 5).toFixed(2);
                logger.info(`Events per second: ${eventsPerSecond}`);
                eventCount = 0;
                lastLogTime = currentTime;
            }
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
