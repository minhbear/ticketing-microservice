import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from '@common_v2/common';
import { Order } from '../models/order.model';
import { stripe } from '../stripe';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId).exec();

        if(!order) {
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Order had been cancelled");
        }

        await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        })

        res.status(201).send({ success: true })
    });

export { router as createChargeRouter };