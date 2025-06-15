import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const payload = req.body;

        // Extract the taskId and other relevant details
        const taskId = payload?.task?.id;

        console.log('Webhook received:', taskId, payload);

        // You can save this taskId to your database or env cache here

        res.status(200).json({ message: 'Webhook received' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
