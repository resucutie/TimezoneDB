// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from '../../../../handlers/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    const { id } = req.query
    
    res.send(await get(id as string))
}
