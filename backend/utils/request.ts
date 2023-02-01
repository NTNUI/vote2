import { Request } from 'express'

export interface RequestWithNtnuiNo extends Request {
	ntnuiNo?: string
}